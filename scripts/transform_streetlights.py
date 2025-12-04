"""
Author: Hồ Viết Hiệp
Created at: 2025-11-15
Updated at: 2025-11-15
Describe: Transform synthetic streetlight GeoJSON to NGSI-LD Streetlight entities.
         Includes relationships to RoadSegment entities.
         Complies with ETSI NGSI-LD spec and FiWARE Streetlighting Data Model.
"""

import json
import sys
from pathlib import Path
from datetime import datetime, timedelta
from tqdm import tqdm

sys.path.append(str(Path(__file__).parent.parent))
from config.config import RAW_DATA_DIR, SOURCE_SYNTHETIC, PROGRESS_INTERVAL
from config.data_model import (
    EntityType,
    create_entity_id,
    get_context,
    create_property,
    create_geo_property,
    create_relationship,
    validate_entity_id
)


def load_streetlights_geojson(filename):
    """
    Load synthetic streetlights GeoJSON file
    
    Args:
        filename: Input filename in raw_data directory
        
    Returns:
        Dict with GeoJSON data
    """
    filepath = Path(RAW_DATA_DIR) / filename
    
    if not filepath.exists():
        raise FileNotFoundError(f"File not found: {filepath}")
    
    print(f"Loading streetlights from {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    features = data.get('features', [])
    print(f"[OK] Loaded {len(features)} streetlight features")
    
    return data


def calculate_illuminance(power_state, lamp_type, power_rating):
    """
    Calculate estimated illuminance level based on lamp parameters
    
    Args:
        power_state: "on" or "off"
        lamp_type: "LED", "HPS", "MH", etc.
        power_rating: Power in watts
        
    Returns:
        Illuminance in lux
    """
    if power_state != "on":
        return 0
    
    # Efficacy (lumens per watt) by lamp type
    efficacy = {
        "LED": 140,  # Modern LED
        "HPS": 100,  # High-pressure sodium
        "MH": 80,    # Metal halide
        "FL": 70     # Fluorescent
    }
    
    lamp_efficacy = efficacy.get(lamp_type, 100)
    
    # Total lumens
    lumens = power_rating * lamp_efficacy
    
    # Estimate illuminance at ground level (simplified)
    # Assuming 8m height, ~50m² coverage area
    coverage_area = 50  # m²
    illuminance = lumens / coverage_area
    
    return round(illuminance)


def generate_switching_times(power_state):
    """
    Generate synthetic switching times based on current state
    
    Args:
        power_state: "on" or "off"
        
    Returns:
        Tuple of (dateLastSwitchingOn, dateLastSwitchingOff)
    """
    now = datetime.now()
    
    if power_state == "on":
        # Light is on, last switched on at ~18:30 yesterday
        last_on = (now - timedelta(days=1)).replace(hour=18, minute=30, second=0, microsecond=0)
        last_off = (now - timedelta(days=2)).replace(hour=6, minute=0, second=0, microsecond=0)
    else:
        # Light is off, last switched off at ~06:00 today
        last_off = now.replace(hour=6, minute=0, second=0, microsecond=0)
        if last_off > now:
            # If 6am hasn't happened yet today, use yesterday
            last_off = last_off - timedelta(days=1)
        last_on = (last_off - timedelta(hours=11, minutes=30))  # On at 18:30 previous day
    
    return (
        last_on.strftime("%Y-%m-%dT%H:%M:%SZ"),
        last_off.strftime("%Y-%m-%dT%H:%M:%SZ")
    )


def create_clean_streetlight_id(streetlight_id):
    """
    Create a clean ID for streetlight entity
    
    Args:
        streetlight_id: Original ID from synthetic data
        
    Returns:
        Clean ID string
    """
    # Replace special characters
    clean_id = str(streetlight_id).replace(' ', '-').replace('_', '-')
    return clean_id


def transform_streetlight_to_ngsi_ld(feature):
    """
    Transform synthetic streetlight feature to NGSI-LD Streetlight entity
    
    Args:
        feature: GeoJSON feature from synthetic data
        
    Returns:
        Dict with NGSI-LD entity or None
    """
    props = feature.get('properties', {})
    geom = feature.get('geometry', {})
    
    # Get coordinates
    coordinates = geom.get('coordinates', [])
    if not coordinates or len(coordinates) != 2:
        return None
    
    lon, lat = coordinates
    
    # Get streetlight ID
    streetlight_id = props.get('streetlight_id', feature.get('id'))
    if not streetlight_id:
        return None
    
    clean_id = create_clean_streetlight_id(streetlight_id)
    
    # Create NGSI-LD entity ID
    entity_id = create_entity_id(EntityType.STREETLIGHT, clean_id)
    
    if not validate_entity_id(entity_id):
        print(f"[WARNING] Invalid entity ID: {entity_id}")
        return None
    
    # Get observation timestamp
    now = datetime.now()
    observed_at = now.strftime("%Y-%m-%dT%H:%M:%SZ")
    
    # Get properties
    status = props.get('status', 'ok')
    power_state = props.get('power_state', 'off')
    lamp_type = props.get('lamp_type', 'LED')
    power_rating = props.get('power_rating', 100)
    lantern_height = props.get('lantern_height', 8)
    
    # Calculate illuminance
    illuminance = calculate_illuminance(power_state, lamp_type, power_rating)
    
    # Generate switching times
    last_on, last_off = generate_switching_times(power_state)
    
    # Build NGSI-LD entity
    entity = {
        "id": entity_id,
        "type": EntityType.STREETLIGHT,
        "@context": get_context(EntityType.STREETLIGHT),
        "location": create_geo_property([lon, lat], "Point")
    }
    
    # Status
    entity["status"] = create_property(
        status,
        observed_at=observed_at
    )
    
    # Power state
    entity["powerState"] = create_property(
        power_state,
        observed_at=observed_at
    )
    
    # Lamp type
    entity["lampType"] = create_property(lamp_type)
    
    # Power rating
    entity["powerRating"] = create_property(
        power_rating,
        unit_code="WTT"
    )
    
    # Lantern height
    entity["lanternHeight"] = create_property(
        lantern_height,
        unit_code="MTR"
    )
    
    # Illuminance level
    entity["illuminanceLevel"] = create_property(
        illuminance,
        unit_code="LX",
        observed_at=observed_at
    )
    
    # Road relationship
    osm_road_id = props.get('osm_road_id')
    if osm_road_id:
        road_segment_id = create_entity_id(EntityType.ROAD_SEGMENT, str(osm_road_id))
        entity["refRoadSegment"] = create_relationship(road_segment_id)
    
    # Switching times
    entity["dateLastSwitchingOn"] = create_property(
        {"@type": "DateTime", "@value": last_on}
    )
    
    entity["dateLastSwitchingOff"] = create_property(
        {"@type": "DateTime", "@value": last_off}
    )
    
    # Metadata
    entity["dateModified"] = create_property(observed_at)
    entity["dataProvider"] = create_property(SOURCE_SYNTHETIC)
    
    road_name = props.get('road_name', 'Unknown Road')
    entity["address"] = create_property({
        "streetAddress": road_name,
        "addressLocality": "Ho Chi Minh City",
        "addressCountry": "VN"
    })
    
    return entity


def transform_all_streetlights(streetlights_geojson):
    """
    Transform all streetlight features to NGSI-LD entities
    
    Args:
        streetlights_geojson: GeoJSON FeatureCollection
        
    Returns:
        List of NGSI-LD entities
    """
    features = streetlights_geojson.get('features', [])
    
    print(f"\nTransforming {len(features)} streetlights to NGSI-LD...")
    
    entities = []
    skipped = 0
    
    for feature in tqdm(features, desc="Transforming", unit="lights"):
        entity = transform_streetlight_to_ngsi_ld(feature)
        
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
        "@context": get_context(EntityType.STREETLIGHT),
        "@graph": entities
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(document, f, indent=2, ensure_ascii=False)
    
    print(f"\n[SAVED] {output_path}")
    
    # Also save as NDJSON
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
    
    # Count by status
    by_status = {}
    by_power_state = {}
    by_lamp_type = {}
    total_power = 0
    with_road_ref = 0
    
    for entity in entities:
        status = entity.get('status', {}).get('value', 'unknown')
        by_status[status] = by_status.get(status, 0) + 1
        
        power_state = entity.get('powerState', {}).get('value', 'unknown')
        by_power_state[power_state] = by_power_state.get(power_state, 0) + 1
        
        lamp_type = entity.get('lampType', {}).get('value', 'unknown')
        by_lamp_type[lamp_type] = by_lamp_type.get(lamp_type, 0) + 1
        
        if 'powerRating' in entity:
            total_power += entity['powerRating']['value']
        
        if 'refRoadSegment' in entity:
            with_road_ref += 1
    
    print(f"\nTotal entities: {len(entities)}")
    print(f"Total power capacity: {total_power/1000:.1f} kW")
    print(f"With road reference: {with_road_ref} ({with_road_ref/len(entities)*100:.1f}%)")
    
    print("\nBy Status:")
    for status, count in sorted(by_status.items(), key=lambda x: x[1], reverse=True):
        percentage = count / len(entities) * 100
        print(f"  {status:15s}: {count:5d} ({percentage:5.1f}%)")
    
    print("\nBy Power State:")
    for state, count in sorted(by_power_state.items(), key=lambda x: x[1], reverse=True):
        percentage = count / len(entities) * 100
        print(f"  {state:15s}: {count:5d} ({percentage:5.1f}%)")
    
    print("\nBy Lamp Type:")
    for lamp, count in sorted(by_lamp_type.items(), key=lambda x: x[1], reverse=True):
        percentage = count / len(entities) * 100
        print(f"  {lamp:15s}: {count:5d} ({percentage:5.1f}%)")
    
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
        print(f"\n{i}. {entity['id']}")
        
        if 'address' in entity:
            addr = entity['address']['value']
            street = addr.get('streetAddress', 'N/A')
            try:
                print(f"   Location: {street}")
            except UnicodeEncodeError:
                print(f"   Location: {street.encode('ascii', 'replace').decode('ascii')}")
        
        status = entity.get('status', {}).get('value', 'N/A')
        power = entity.get('powerState', {}).get('value', 'N/A')
        lamp = entity.get('lampType', {}).get('value', 'N/A')
        
        print(f"   Status: {status} | Power: {power} | Type: {lamp}")
        
        if 'powerRating' in entity:
            rating = entity['powerRating']['value']
            print(f"   Power Rating: {rating}W")
        
        if 'illuminanceLevel' in entity:
            lux = entity['illuminanceLevel']['value']
            print(f"   Illuminance: {lux} lux")
        
        # Validate structure
        required_fields = ['id', 'type', '@context', 'location', 'status', 'powerState']
        missing = [f for f in required_fields if f not in entity]
        
        if missing:
            print(f"   [WARNING] Missing required fields: {missing}")
        else:
            print(f"   [OK] All required fields present")


def main():
    """Main execution"""
    print("=" * 70)
    print("UrbanReflex - Streetlights to NGSI-LD Transformer")
    print("=" * 70)
    
    # Check command-line argument
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    else:
        input_file = "synthetic_streetlights_center_latest.json"
    
    try:
        # Load streetlights
        streetlights_geojson = load_streetlights_geojson(input_file)
        
        # Transform to NGSI-LD
        entities = transform_all_streetlights(streetlights_geojson)
        
        if not entities:
            print("[ERROR] No valid entities created")
            return 1
        
        # Validate samples
        validate_sample(entities)
        
        # Print statistics
        print_statistics(entities)
        
        # Save output
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"streetlights_{timestamp}.jsonld"
        save_entities(entities, output_file)
        
        # Also save as latest
        save_entities(entities, "streetlights_latest.jsonld")
        
        print(f"\n[SUCCESS] Transformation completed!")
        print(f"\nOutput files:")
        print(f"   - ngsi_ld_entities/{output_file}")
        print(f"   - ngsi_ld_entities/streetlights_latest.jsonld")
        print(f"   - ngsi_ld_entities/streetlights_latest.ndjson")
        
        return 0
        
    except FileNotFoundError as e:
        print(f"[ERROR] {e}")
        print("\nPlease run generate_synthetic_streetlights.py first.")
        return 1
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit(main())

