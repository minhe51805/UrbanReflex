# ============================================================================
# UrbanReflex — Smart City Intelligence Platform
# Copyright (C) 2025  WAG
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
# For more information, visit: https://github.com/minhe51805/UrbanReflex
# ============================================================================

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
    SOURCE_OSM,
    PROGRESS_INTERVAL
)

# Target road types for UrbanReflex
ROAD_TYPES = ["primary", "secondary", "tertiary", "residential"]


def build_overpass_query(bbox, road_types):
    """
    Build Overpass QL query for road network
    
    Args:
        bbox: Tuple of (min_lat, min_lon, max_lat, max_lon)
        road_types: List of highway types to fetch
        
    Returns:
        Overpass QL query string
    """
    min_lat, min_lon, max_lat, max_lon = bbox
    
    # Build type filter
    type_filter = "|".join(road_types)
    
    query = f"""
    [out:json][timeout:300];
    (
      way["highway"~"^({type_filter})$"]({min_lat},{min_lon},{max_lat},{max_lon});
    );
    out body;
    >;
    out skel qt;
    """
    
    return query


def fetch_roads(bbox, road_types, use_alt_server=False):
    """
    Fetch roads from OpenStreetMap Overpass API
    
    Args:
        bbox: Bounding box tuple (min_lat, min_lon, max_lat, max_lon)
        road_types: List of highway types to retrieve
        use_alt_server: If True, use alternative Overpass server
        
    Returns:
        Dict with OSM data or None if failed
    """
    api_url = OVERPASS_API_URL_ALT if use_alt_server else OVERPASS_API_URL
    query = build_overpass_query(bbox, road_types)
    
    print(f"Fetching roads from OSM Overpass API...")
    
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
        ways = [e for e in elements if e.get("type") == "way"]
        nodes = [e for e in elements if e.get("type") == "node"]
        
        print(f"[OK] Success! Retrieved {len(ways)} roads with {len(nodes)} nodes")
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


def convert_to_geojson(osm_data):
    """
    Convert OSM data to GeoJSON format
    
    Args:
        osm_data: OSM JSON response from Overpass API
        
    Returns:
        GeoJSON FeatureCollection
    """
    elements = osm_data.get("elements", [])
    
    # Build node lookup table
    nodes = {}
    for element in elements:
        if element.get("type") == "node":
            node_id = element["id"]
            nodes[node_id] = [element["lon"], element["lat"]]
    
    # Build road features
    features = []
    for element in elements:
        if element.get("type") == "way":
            # Get node coordinates
            node_refs = element.get("nodes", [])
            coordinates = [nodes[nid] for nid in node_refs if nid in nodes]
            
            if len(coordinates) < 2:
                continue  # Skip invalid geometries
            
            # Extract properties
            tags = element.get("tags", {})
            
            feature = {
                "type": "Feature",
                "id": element["id"],
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinates
                },
                "properties": {
                    "osm_id": element["id"],
                    "highway": tags.get("highway", "unknown"),
                    "name": tags.get("name", "Unnamed Road"),
                    "name_en": tags.get("name:en"),
                    "surface": tags.get("surface"),
                    "lanes": tags.get("lanes"),
                    "maxspeed": tags.get("maxspeed"),
                    "oneway": tags.get("oneway"),
                    "lit": tags.get("lit"),
                    "width": tags.get("width")
                }
            }
            
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
    print("UrbanReflex - OSM Road Network Fetcher")
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
        filename = "osm_roads_full.json"
    else:
        bbox = HCMC_BBOX_CENTER
        filename = "osm_roads_center.json"
    
    # Fetch roads
    osm_data = fetch_roads(bbox, ROAD_TYPES, use_alt_server=False)
    
    if osm_data is None:
        print("\n[WARNING] Primary server failed. Trying alternative server...")
        time.sleep(2)
        osm_data = fetch_roads(bbox, ROAD_TYPES, use_alt_server=True)
    
    if osm_data is None:
        print("\n[ERROR] Failed to fetch roads from both servers.")
        print("Please try again later or reduce the bounding box size.")
        return 1
    
    # Save raw OSM data
    print("\n[SAVING] Raw OSM data...")
    save_data(osm_data, f"raw_{filename}")
    
    # Convert to GeoJSON
    print("\n[CONVERTING] OSM to GeoJSON format...")
    geojson = convert_to_geojson(osm_data)
    
    print(f"[OK] Converted {geojson['metadata']['count']} roads to GeoJSON")
    
    # Save GeoJSON
    save_data(geojson, filename)
    
    # Print statistics
    print("\n" + "=" * 70)
    print("STATISTICS:")
    print("=" * 70)
    
    highway_counts = {}
    for feature in geojson["features"]:
        highway_type = feature["properties"]["highway"]
        highway_counts[highway_type] = highway_counts.get(highway_type, 0) + 1
    
    for highway_type, count in sorted(highway_counts.items()):
        print(f"  {highway_type:15s}: {count:5d} roads")
    
    print(f"\n  {'TOTAL':15s}: {len(geojson['features']):5d} roads")
    print("=" * 70)
    
    print("\n[SUCCESS] Road network fetch completed!")
    print(f"\nOutput files:")
    print(f"   - {RAW_DATA_DIR}/raw_{filename}")
    print(f"   - {RAW_DATA_DIR}/{filename}")
    
    return 0


if __name__ == "__main__":
    exit(main())

