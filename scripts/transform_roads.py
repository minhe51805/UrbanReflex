"""
Author: Hồ Viết Hiệp
Created at: 2025-11-15
Updated at: 2025-11-15
Describe: Transform OSM road GeoJSON to NGSI-LD RoadSegment entities.
         Complies with ETSI NGSI-LD spec and FiWARE standards.
"""

import json
import sys
from pathlib import Path
from datetime import datetime
from tqdm import tqdm

# Import config and helpers
sys.path.append(str(Path(__file__).parent.parent))
from config.config import RAW_DATA_DIR, AREA_NAME
from config.data_model import (
    EntityType,
    create_entity_id,
    get_context,
    create_property,
    create_geo_property,
    validate_entity_id,
    validate_coordinates
)


def load_roads_geojson(filename):
    """
    Load roads GeoJSON file
    
    Args:
        filename: Input filename in raw_data directory
        
    Returns:
        Dict with GeoJSON data
    """
    filepath = Path(RAW_DATA_DIR) / filename
    
    if not filepath.exists():
        raise FileNotFoundError(f"File not found: {filepath}")
    
    print(f"Loading roads from {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    features = data.get('features', [])
    print(f"[OK] Loaded {len(features)} road features")
    
    return data


def calculate_road_length(coordinates):
    """
    Calculate approximate road length from coordinates
    
    Args:
        coordinates: List of [lon, lat] pairs
        
    Returns:
        Length in meters (approximate)
    """
    if len(coordinates) < 2:
        return 0
    
    # Simple distance calculation (Haversine would be more accurate)
    # For small distances, flat approximation is acceptable
    total_length = 0
    for i in range(len(coordinates) - 1):
        lon1, lat1 = coordinates[i]
        lon2, lat2 = coordinates[i + 1]
        
        # Convert to meters (approximate at HCMC latitude)
        dx = (lon2 - lon1) * 111320  # meters per degree longitude at ~10° lat
        dy = (lat2 - lat1) * 111000  # meters per degree latitude
        
        segment_length = (dx**2 + dy**2)**0.5
        total_length += segment_length
    
    return round(total_length, 2)


def parse_lanes(lanes_str):
    """
    Parse lanes string to integer
    
    Args:
        lanes_str: String like "4" or "2;2"
        
    Returns:
        Integer lane count or None
    """
    if not lanes_str:
        return None
    
    try:
        # Handle cases like "2;2" (split directions)
        if ';' in str(lanes_str):
            parts = str(lanes_str).split(';')
            return sum(int(p) for p in parts if p.strip())
        return int(lanes_str)
    except (ValueError, TypeError):
        return None


def transform_road_to_ngsi_ld(feature):
    """
    Transform OSM road feature to NGSI-LD RoadSegment entity
    
    Args:
        feature: GeoJSON feature from OSM
        
    Returns:
        Dict with NGSI-LD entity
    """
    props = feature.get('properties', {})
    geom = feature.get('geometry', {})
    
    # Get OSM ID
    osm_id = props.get('osm_id', feature.get('id'))
    if not osm_id:
        return None
    
    # Create NGSI-LD entity ID
    entity_id = create_entity_id(EntityType.ROAD_SEGMENT, str(osm_id))
    
    # Validate ID
    if not validate_entity_id(entity_id):
        print(f"[WARNING] Invalid entity ID: {entity_id}")
        return None
    
    # Get coordinates
    coordinates = geom.get('coordinates', [])
    if not coordinates or len(coordinates) < 2:
        return None
    
    # Calculate length
    length = calculate_road_length(coordinates)
    
    # Parse lanes
    lanes = parse_lanes(props.get('lanes'))
    
    # Build NGSI-LD entity
    entity = {
        "id": entity_id,
        "type": EntityType.ROAD_SEGMENT,
        "@context": get_context(EntityType.ROAD_SEGMENT),
        "name": create_property(props.get('name', 'Unnamed Road')),
        "location": create_geo_property(coordinates, "LineString"),
        "roadType": create_property(props.get('highway', 'unknown'))
    }
    
    # Optional properties
    if length > 0:
        entity["length"] = create_property(length, unit_code="MTR")
    
    if lanes:
        entity["laneCount"] = create_property(lanes)
    
    if props.get('width'):
        try:
            width = float(props['width'])
            entity["width"] = create_property(width, unit_code="MTR")
        except (ValueError, TypeError):
            pass
    
    if props.get('surface'):
        entity["surface"] = create_property(props['surface'])
    
    if props.get('maxspeed'):
        entity["maximumAllowedSpeed"] = create_property(props['maxspeed'])
    
    if props.get('oneway'):
        oneway = props['oneway'] in ['yes', 'true', '1', True]
        entity["oneway"] = create_property(oneway)
    
    if props.get('lit'):
        lit = props['lit'] in ['yes', 'true', '1', True]
        entity["lit"] = create_property(lit)
    
    # Add metadata
    entity["dateCreated"] = create_property(
        datetime.now().isoformat() + "Z"
    )
    
    entity["dataProvider"] = create_property("OpenStreetMap")
    entity["source"] = create_property(f"OSM way/{osm_id}")
    
    return entity


def transform_all_roads(roads_geojson):
    """
    Transform all road features to NGSI-LD entities
    
    Args:
        roads_geojson: GeoJSON FeatureCollection
        
    Returns:
        List of NGSI-LD entities
    """
    features = roads_geojson.get('features', [])
    
    print(f"\nTransforming {len(features)} roads to NGSI-LD...")
    
    entities = []
    skipped = 0
    
    for feature in tqdm(features, desc="Transforming", unit="roads"):
        entity = transform_road_to_ngsi_ld(feature)
        
        if entity:
            entities.append(entity)
        else:
            skipped += 1
    
    print(f"\n[OK] Transformed {len(entities)} entities")
    if skipped > 0:
        print(f"[WARNING] Skipped {skipped} invalid features")
    
    return entities


def save_entities(entities, output_file):
    """
    Save NGSI-LD entities to file
    
    Args:
        entities: List of NGSI-LD entities
        output_file: Output filename
    """
    output_dir = Path("ngsi_ld_entities")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_path = output_dir / output_file
    
    # Create JSON-LD document
    document = {
        "@context": get_context(EntityType.ROAD_SEGMENT),
        "@graph": entities
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(document, f, indent=2, ensure_ascii=False)
    
    print(f"\n[SAVED] {output_path}")
    
    # Also save as NDJSON (one entity per line) for batch loading
    ndjson_path = output_dir / output_file.replace('.jsonld', '.ndjson')
    with open(ndjson_path, 'w', encoding='utf-8') as f:
        for entity in entities:
            f.write(json.dumps(entity, ensure_ascii=False) + '\n')
    
    print(f"[SAVED] {ndjson_path} (NDJSON format for batch loading)")


def print_statistics(entities):
    """
    Print transformation statistics
    
    Args:
        entities: List of NGSI-LD entities
    """
    print("\n" + "=" * 70)
    print("TRANSFORMATION STATISTICS:")
    print("=" * 70)
    
    # Count by road type
    by_type = {}
    total_length = 0
    with_lanes = 0
    with_lit = 0
    
    for entity in entities:
        road_type = entity.get('roadType', {}).get('value', 'unknown')
        by_type[road_type] = by_type.get(road_type, 0) + 1
        
        if 'length' in entity:
            total_length += entity['length']['value']
        
        if 'laneCount' in entity:
            with_lanes += 1
        
        if 'lit' in entity:
            with_lit += 1
    
    print(f"\nTotal entities: {len(entities)}")
    print(f"Total length: {total_length/1000:.2f} km")
    print(f"With lane info: {with_lanes} ({with_lanes/len(entities)*100:.1f}%)")
    print(f"With lighting info: {with_lit} ({with_lit/len(entities)*100:.1f}%)")
    
    print("\nBy Road Type:")
    for road_type, count in sorted(by_type.items(), key=lambda x: x[1], reverse=True):
        percentage = count / len(entities) * 100
        print(f"  {road_type:15s}: {count:5d} ({percentage:5.1f}%)")
    
    print("=" * 70)


def validate_sample(entities, sample_size=3):
    """
    Validate and display sample entities
    
    Args:
        entities: List of NGSI-LD entities
        sample_size: Number of samples to display
    """
    print(f"\n{'=' * 70}")
    print(f"SAMPLE ENTITIES (first {sample_size}):")
    print("=" * 70)
    
    for i, entity in enumerate(entities[:sample_size], 1):
        name = entity.get('name', {}).get('value', 'N/A')
        road_type = entity.get('roadType', {}).get('value', 'N/A')
        
        print(f"\n{i}. {entity['id']}")
        try:
            print(f"   Name: {name}")
        except UnicodeEncodeError:
            print(f"   Name: {name.encode('ascii', 'replace').decode('ascii')}")
        print(f"   Type: {road_type}")
        
        if 'length' in entity:
            print(f"   Length: {entity['length']['value']:.2f}m")
        
        if 'laneCount' in entity:
            print(f"   Lanes: {entity['laneCount']['value']}")
        
        # Validate structure
        required_fields = ['id', 'type', '@context', 'name', 'location']
        missing = [f for f in required_fields if f not in entity]
        
        if missing:
            print(f"   [WARNING] Missing required fields: {missing}")
        else:
            print(f"   [OK] All required fields present")


def main():
    """Main execution"""
    print("=" * 70)
    print("UrbanReflex - Roads to NGSI-LD Transformer")
    print("=" * 70)
    
    # Check command-line argument
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    else:
        input_file = "osm_roads_center.json"
    
    try:
        # Load roads
        roads_geojson = load_roads_geojson(input_file)
        
        # Transform to NGSI-LD
        entities = transform_all_roads(roads_geojson)
        
        if not entities:
            print("[ERROR] No valid entities created")
            return 1
        
        # Validate samples
        validate_sample(entities)
        
        # Print statistics
        print_statistics(entities)
        
        # Save output
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"road_segments_{timestamp}.jsonld"
        save_entities(entities, output_file)
        
        # Also save as latest
        save_entities(entities, "road_segments_latest.jsonld")
        
        print(f"\n[SUCCESS] Transformation completed!")
        print(f"\nOutput files:")
        print(f"   - ngsi_ld_entities/{output_file}")
        print(f"   - ngsi_ld_entities/road_segments_latest.jsonld")
        print(f"   - ngsi_ld_entities/road_segments_latest.ndjson")
        
        return 0
        
    except FileNotFoundError as e:
        print(f"[ERROR] {e}")
        print("\nPlease run fetch_osm_roads.py first to collect road data.")
        return 1
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit(main())

