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

import json
import random
from pathlib import Path
from datetime import datetime
from shapely.geometry import LineString, Point
from shapely.ops import linemerge

# Import config
import sys
sys.path.append(str(Path(__file__).parent.parent))
from config.config import (
    RAW_DATA_DIR,
    STREETLIGHT_SPACING_MIN,
    STREETLIGHT_SPACING_MAX,
    STREETLIGHT_ROAD_TYPES,
    METERS_PER_DEGREE,
    PROGRESS_INTERVAL,
    AREA_NAME,
    SOURCE_SYNTHETIC
)


def load_geojson(filename):
    """
    Load GeoJSON file
    
    Args:
        filename: Path to GeoJSON file
        
    Returns:
        Dict with GeoJSON data
    """
    filepath = Path(RAW_DATA_DIR) / filename
    
    if not filepath.exists():
        raise FileNotFoundError(f"File not found: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    return data


def generate_streetlights_along_line(line_geom, road_id, road_name, road_type, spacing):
    """
    Generate streetlight points along a LineString geometry
    
    Args:
        line_geom: Shapely LineString geometry
        road_id: OSM road ID
        road_name: Road name
        road_type: Highway type (primary, secondary, etc.)
        spacing: Distance between streetlights in meters
        
    Returns:
        List of streetlight feature dicts
    """
    streetlights = []
    
    # Convert spacing from meters to degrees
    spacing_degrees = spacing / METERS_PER_DEGREE
    
    # Get total length
    total_length = line_geom.length
    
    if total_length < spacing_degrees:
        # Road too short, place one light in the middle
        mid_point = line_geom.interpolate(0.5, normalized=True)
        
        streetlight = create_streetlight_feature(
            lon=mid_point.x,
            lat=mid_point.y,
            road_id=road_id,
            road_name=road_name,
            road_type=road_type,
            index=0
        )
        streetlights.append(streetlight)
    else:
        # Place streetlights at regular intervals
        num_lights = int(total_length / spacing_degrees)
        
        for i in range(num_lights + 1):
            distance = i * spacing_degrees
            
            if distance > total_length:
                break
            
            point = line_geom.interpolate(distance)
            
            streetlight = create_streetlight_feature(
                lon=point.x,
                lat=point.y,
                road_id=road_id,
                road_name=road_name,
                road_type=road_type,
                index=i
            )
            streetlights.append(streetlight)
    
    return streetlights


def create_streetlight_feature(lon, lat, road_id, road_name, road_type, index):
    """
    Create a streetlight feature in GeoJSON format
    
    Args:
        lon: Longitude
        lat: Latitude
        road_id: OSM road ID
        road_name: Road name
        road_type: Highway type
        index: Streetlight index along the road
        
    Returns:
        GeoJSON feature dict
    """
    # Generate synthetic ID
    streetlight_id = f"{road_id}-sl-{index}"
    
    # Randomize some properties for realism
    statuses = ["ok", "ok", "ok", "defectiveLamp", "brokenLamp"]  # 60% ok, 20% defective, 20% broken
    power_states = ["on", "off"]  # Will depend on time of day in real system
    lamp_types = ["LED", "LED", "LED", "HPS", "MH"]  # 60% LED, 20% HPS, 20% Metal Halide
    power_ratings = [60, 80, 100, 120, 150]  # Watts
    
    status = random.choice(statuses)
    lamp_type = random.choice(lamp_types)
    power_rating = random.choice(power_ratings)
    
    # For demo, assume it's daytime so lights are off
    power_state = "off"
    
    feature = {
        "type": "Feature",
        "id": streetlight_id,
        "geometry": {
            "type": "Point",
            "coordinates": [lon, lat]
        },
        "properties": {
            "streetlight_id": streetlight_id,
            "osm_road_id": road_id,
            "road_name": road_name,
            "road_type": road_type,
            "status": status,
            "power_state": power_state,
            "lamp_type": lamp_type,
            "power_rating": power_rating,
            "lantern_height": 8 if road_type in ["primary", "secondary"] else 6,
            "source": "synthetic"
        }
    }
    
    return feature


def generate_streetlights_from_roads(roads_geojson, spacing_min=30, spacing_max=50, road_types=None):
    """
    Generate synthetic streetlights from road network
    
    Args:
        roads_geojson: GeoJSON FeatureCollection of roads
        spacing_min: Minimum spacing between lights (meters)
        spacing_max: Maximum spacing between lights (meters)
        road_types: List of highway types to generate lights for
        
    Returns:
        GeoJSON FeatureCollection of streetlights
    """
    if road_types is None:
        road_types = STREETLIGHT_ROAD_TYPES
    
    print(f"Generating synthetic streetlights...")
    
    all_streetlights = []
    road_count = 0
    skipped_count = 0
    
    features = roads_geojson.get('features', [])
    
    for feature in features:
        road_type = feature['properties'].get('highway')
        
        # Skip if not in target road types
        if road_type not in road_types:
            skipped_count += 1
            continue
        
        road_id = feature['properties'].get('osm_id', feature.get('id'))
        road_name = feature['properties'].get('name', 'Unnamed Road')
        
        # Get geometry
        geom = feature['geometry']
        
        if geom['type'] != 'LineString':
            continue
        
        # Create Shapely LineString
        coords = geom['coordinates']
        line = LineString(coords)
        
        # Random spacing for this road
        spacing = random.uniform(spacing_min, spacing_max)
        
        # Generate streetlights along this road
        streetlights = generate_streetlights_along_line(
            line, road_id, road_name, road_type, spacing
        )
        
        all_streetlights.extend(streetlights)
        road_count += 1
        
        if road_count % PROGRESS_INTERVAL == 0:
            print(f"  Processed {road_count} roads, generated {len(all_streetlights)} streetlights...")
    
    print(f"\n[OK] Generated {len(all_streetlights)} streetlights from {road_count} roads")
    print(f"     Skipped {skipped_count} roads (wrong type)")
    
    geojson = {
        "type": "FeatureCollection",
        "metadata": {
            "generated": datetime.now(datetime.UTC).isoformat() if hasattr(datetime, 'UTC') else datetime.utcnow().isoformat() + "Z",
            "source": SOURCE_SYNTHETIC,
            "area": AREA_NAME,
            "spacing_min_m": spacing_min,
            "spacing_max_m": spacing_max,
            "road_types": road_types,
            "count": len(all_streetlights)
        },
        "features": all_streetlights
    }
    
    return geojson


def save_geojson(data, filename, indent=2):
    """
    Save GeoJSON to file
    
    Args:
        data: GeoJSON data
        filename: Output filename
        indent: JSON indentation
    """
    output_dir = Path(RAW_DATA_DIR)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_path = output_dir / filename
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=indent, ensure_ascii=False)
    
    print(f"[SAVED] {output_path}")


def print_statistics(streetlights_geojson):
    """
    Print statistics about generated streetlights
    
    Args:
        streetlights_geojson: GeoJSON FeatureCollection of streetlights
    """
    print("\n" + "=" * 70)
    print("STREETLIGHT GENERATION STATISTICS:")
    print("=" * 70)
    
    features = streetlights_geojson['features']
    
    # Count by road type
    by_road_type = {}
    by_status = {}
    by_lamp_type = {}
    
    for feature in features:
        props = feature['properties']
        
        road_type = props.get('road_type', 'unknown')
        status = props.get('status', 'unknown')
        lamp_type = props.get('lamp_type', 'unknown')
        
        by_road_type[road_type] = by_road_type.get(road_type, 0) + 1
        by_status[status] = by_status.get(status, 0) + 1
        by_lamp_type[lamp_type] = by_lamp_type.get(lamp_type, 0) + 1
    
    print("\nBy Road Type:")
    for road_type, count in sorted(by_road_type.items()):
        print(f"  {road_type:15s}: {count:6d} streetlights")
    
    print(f"\n  {'TOTAL':15s}: {len(features):6d} streetlights")
    
    print("\nBy Status:")
    for status, count in sorted(by_status.items()):
        percentage = (count / len(features)) * 100
        print(f"  {status:15s}: {count:6d} ({percentage:5.1f}%)")
    
    print("\nBy Lamp Type:")
    for lamp_type, count in sorted(by_lamp_type.items()):
        percentage = (count / len(features)) * 100
        print(f"  {lamp_type:15s}: {count:6d} ({percentage:5.1f}%)")
    
    print("=" * 70)


def main():
    """Main execution"""
    print("=" * 70)
    print("UrbanReflex - Synthetic Streetlight Generator")
    print("=" * 70)
    
    # Check for command-line arguments
    import sys
    
    # Determine input file
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    else:
        # Default to center roads
        input_file = "osm_roads_center.json"
    
    print(f"\nInput file: {input_file}")
    
    # Load roads GeoJSON
    try:
        roads_geojson = load_geojson(input_file)
        print(f"[OK] Loaded {len(roads_geojson.get('features', []))} roads")
    except FileNotFoundError as e:
        print(f"[ERROR] {e}")
        print("\nPlease run fetch_osm_roads.py first to download road data.")
        return 1
    except Exception as e:
        print(f"[ERROR] Failed to load roads: {e}")
        return 1
    
    # Generate streetlights
    streetlights_geojson = generate_streetlights_from_roads(
        roads_geojson,
        spacing_min=STREETLIGHT_SPACING_MIN,
        spacing_max=STREETLIGHT_SPACING_MAX,
        road_types=STREETLIGHT_ROAD_TYPES
    )
    
    # Save output
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Determine output filename based on input
    if "center" in input_file:
        output_file = f"synthetic_streetlights_center_{timestamp}.json"
        latest_file = "synthetic_streetlights_center_latest.json"
    elif "full" in input_file:
        output_file = f"synthetic_streetlights_full_{timestamp}.json"
        latest_file = "synthetic_streetlights_full_latest.json"
    else:
        output_file = f"synthetic_streetlights_{timestamp}.json"
        latest_file = "synthetic_streetlights_latest.json"
    
    print(f"\n[SAVING] Synthetic streetlights...")
    save_geojson(streetlights_geojson, output_file)
    save_geojson(streetlights_geojson, latest_file)
    

    print_statistics(streetlights_geojson)
    
    print(f"\n[SUCCESS] Streetlight generation completed!")
    print(f"\nOutput files:")
    print(f"   - {RAW_DATA_DIR}/{output_file}")
    print(f"   - {RAW_DATA_DIR}/{latest_file}")
    
    return 0


if __name__ == "__main__":
    exit(main())

