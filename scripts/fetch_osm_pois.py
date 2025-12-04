"""
Author: Hồ Viết Hiệp
Created at: 2025-11-15
Updated at: 2025-11-16
Describe: Fetch Points of Interest (POI) from OpenStreetMap for HCMC.
         Retrieves schools, hospitals, parks, and parking areas.
"""

import requests
import json
import time
from pathlib import Path
from datetime import datetime

# Import config
import sys
sys.path.append(str(Path(__file__).parent.parent))
from config.config import (
    HCMC_BBOX_FULL,
    HCMC_BBOX_CENTER,
    OVERPASS_API_URL,
    OVERPASS_API_URL_ALT,
    RAW_DATA_DIR,
    AREA_NAME,
    SOURCE_OSM
)

# POI categories to fetch
POI_CATEGORIES = {
    "schools": 'node["amenity"="school"]',
    "hospitals": 'node["amenity"="hospital"]',
    "parks": 'way["leisure"="park"]',
    "parking": 'node["amenity"="parking"]'
}


def build_overpass_query(bbox, poi_categories):
    """
    Build Overpass QL query for POIs
    
    Args:
        bbox: Tuple of (min_lat, min_lon, max_lat, max_lon)
        poi_categories: Dict of category name to Overpass filter
        
    Returns:
        Overpass QL query string
    """
    min_lat, min_lon, max_lat, max_lon = bbox
    
    # Build query parts for each category
    query_parts = []
    for category, filter_str in poi_categories.items():
        query_parts.append(f"  {filter_str}({min_lat},{min_lon},{max_lat},{max_lon});")
    
    query = f"""
    [out:json][timeout:300];
    (
{chr(10).join(query_parts)}
    );
    out body;
    >;
    out skel qt;
    """
    
    return query


def fetch_pois(bbox, poi_categories, use_alt_server=False):
    """
    Fetch POIs from OpenStreetMap Overpass API
    
    Args:
        bbox: Bounding box tuple (min_lat, min_lon, max_lat, max_lon)
        poi_categories: Dict of POI categories to fetch
        use_alt_server: If True, use alternative Overpass server
        
    Returns:
        Dict with OSM data or None if failed
    """
    api_url = OVERPASS_API_URL_ALT if use_alt_server else OVERPASS_API_URL
    query = build_overpass_query(bbox, poi_categories)
    
    print(f"Fetching POIs from OSM Overpass API...")
    
    try:
        response = requests.post(
            api_url,
            data={"data": query},
            timeout=180
        )
        response.raise_for_status()
        
        data = response.json()
        
        # Count elements
        elements = data.get("elements", [])
        nodes = [e for e in elements if e.get("type") == "node" and "tags" in e]
        ways = [e for e in elements if e.get("type") == "way" and "tags" in e]
        
        print(f"[OK] Success! Retrieved {len(nodes)} POI nodes and {len(ways)} POI areas")
        return data
        
    except requests.Timeout:
        print(f"[TIMEOUT] Query took too long.")
        return None
    except requests.RequestException as e:
        print(f"[ERROR] Request error: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"[ERROR] JSON decode error: {e}")
        return None


def categorize_poi(tags):
    """
    Determine POI category from OSM tags
    
    Args:
        tags: Dict of OSM tags
        
    Returns:
        String category name or "other"
    """
    if tags.get("amenity") == "school":
        return "school"
    elif tags.get("amenity") == "hospital":
        return "hospital"
    elif tags.get("leisure") == "park":
        return "park"
    elif tags.get("amenity") == "parking":
        return "parking"
    else:
        return "other"


def convert_to_geojson(osm_data):
    """
    Convert OSM data to GeoJSON format
    
    Args:
        osm_data: OSM JSON response from Overpass API
        
    Returns:
        GeoJSON FeatureCollection
    """
    elements = osm_data.get("elements", [])
    
    # Build node lookup table for ways
    nodes = {}
    for element in elements:
        if element.get("type") == "node":
            node_id = element["id"]
            nodes[node_id] = [element["lon"], element["lat"]]
    
    # Build POI features
    features = []
    
    for element in elements:
        tags = element.get("tags", {})
        
        # Skip elements without tags (they are just nodes for ways)
        if not tags:
            continue
        
        feature = None
        
        # Handle node POIs (schools, hospitals, parking)
        if element.get("type") == "node":
            feature = {
                "type": "Feature",
                "id": element["id"],
                "geometry": {
                    "type": "Point",
                    "coordinates": [element["lon"], element["lat"]]
                },
                "properties": {
                    "osm_id": element["id"],
                    "osm_type": "node",
                    "category": categorize_poi(tags),
                    "name": tags.get("name", "Unnamed POI"),
                    "name_en": tags.get("name:en"),
                    "amenity": tags.get("amenity"),
                    "leisure": tags.get("leisure"),
                    "operator": tags.get("operator"),
                    "phone": tags.get("phone"),
                    "website": tags.get("website"),
                    "opening_hours": tags.get("opening_hours"),
                    "wheelchair": tags.get("wheelchair")
                }
            }
        
        # Handle way POIs (parks)
        elif element.get("type") == "way":
            node_refs = element.get("nodes", [])
            coordinates = [nodes[nid] for nid in node_refs if nid in nodes]
            
            if len(coordinates) < 3:
                continue  # Skip invalid polygons
            
            # Close the polygon if not already closed
            if coordinates[0] != coordinates[-1]:
                coordinates.append(coordinates[0])
            
            feature = {
                "type": "Feature",
                "id": element["id"],
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [coordinates]
                },
                "properties": {
                    "osm_id": element["id"],
                    "osm_type": "way",
                    "category": categorize_poi(tags),
                    "name": tags.get("name", "Unnamed Area"),
                    "name_en": tags.get("name:en"),
                    "amenity": tags.get("amenity"),
                    "leisure": tags.get("leisure"),
                    "operator": tags.get("operator"),
                    "access": tags.get("access"),
                    "surface": tags.get("surface")
                }
            }
        
        if feature:
            features.append(feature)
    
    geojson = {
        "type": "FeatureCollection",
        "metadata": {
            "generated": datetime.now(datetime.UTC).isoformat() if hasattr(datetime, 'UTC') else datetime.utcnow().isoformat() + "Z",
            "source": SOURCE_OSM,
            "area": AREA_NAME,
            "count": len(features)
        },
        "features": features
    }
    
    return geojson


def save_data(data, filename, indent=2):
    """
    Save data to JSON file
    
    Args:
        data: Data to save
        filename: Output filename
        indent: JSON indentation (default: 2)
    """
    output_dir = Path(RAW_DATA_DIR)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_path = output_dir / filename
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=indent, ensure_ascii=False)
    
    print(f"[SAVED] {output_path}")


def main():
    """Main execution"""
    print("=" * 70)
    print("UrbanReflex - OSM Points of Interest Fetcher")
    print("=" * 70)
    
    # Check for command-line argument
    import sys
    if len(sys.argv) > 1:
        choice = sys.argv[1]
    else:
        # Choose bounding box
        print("\nSelect area:")
        print("1. Full HCMC (large, may timeout)")
        print("2. Central HCMC (recommended for testing)")
        
        try:
            choice = input("Enter choice (1 or 2, default=2): ").strip() or "2"
        except EOFError:
            # Non-interactive mode, use default
            choice = "2"
            print("Using default: Central HCMC")
    
    if choice == "1":
        bbox = HCMC_BBOX_FULL
        filename = "osm_pois_full.json"
    else:
        bbox = HCMC_BBOX_CENTER
        filename = "osm_pois_center.json"
    
    # Fetch POIs
    osm_data = fetch_pois(bbox, POI_CATEGORIES, use_alt_server=False)
    
    if osm_data is None:
        print("\n[WARNING] Primary server failed. Trying alternative server...")
        time.sleep(2)
        osm_data = fetch_pois(bbox, POI_CATEGORIES, use_alt_server=True)
    
    if osm_data is None:
        print("\n[ERROR] Failed to fetch POIs from both servers.")
        print("Please try again later or reduce the bounding box size.")
        return 1
    
    # Save raw OSM data
    print("\n[SAVING] Raw OSM data...")
    save_data(osm_data, f"raw_{filename}")
    
    # Convert to GeoJSON
    print("\n[CONVERTING] OSM to GeoJSON format...")
    geojson = convert_to_geojson(osm_data)
    
    print(f"[OK] Converted {geojson['metadata']['count']} POIs to GeoJSON")
    
    # Save GeoJSON
    save_data(geojson, filename)
    
    # Print statistics
    print("\n" + "=" * 70)
    print("STATISTICS:")
    print("=" * 70)
    
    category_counts = {}
    geometry_counts = {}
    
    for feature in geojson["features"]:
        category = feature["properties"]["category"]
        geometry_type = feature["geometry"]["type"]
        
        category_counts[category] = category_counts.get(category, 0) + 1
        geometry_counts[geometry_type] = geometry_counts.get(geometry_type, 0) + 1
    
    print("\nBy Category:")
    for category, count in sorted(category_counts.items()):
        print(f"  {category:15s}: {count:5d} POIs")
    
    print(f"\n  {'TOTAL':15s}: {len(geojson['features']):5d} POIs")
    
    print("\nBy Geometry:")
    for geom_type, count in sorted(geometry_counts.items()):
        print(f"  {geom_type:15s}: {count:5d} features")
    
    print("=" * 70)
    
    print("\n[SUCCESS] POI fetch completed!")
    print(f"\nOutput files:")
    print(f"   - {RAW_DATA_DIR}/raw_{filename}")
    print(f"   - {RAW_DATA_DIR}/{filename}")
    
    return 0


if __name__ == "__main__":
    exit(main())

