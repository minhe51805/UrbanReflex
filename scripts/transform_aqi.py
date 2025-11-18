"""
Author: Hồ Viết Hiệp
Created at: 2025-11-15
Updated at: 2025-11-16
Describe: Transform OpenAQ location data to NGSI-LD AirQualityObserved entities.
         Uses synthetic measurements since OpenAQ data for HCMC is outdated.
         Complies with ETSI NGSI-LD spec and FiWARE Environment Data Model.
"""

import json
import sys
import random
from pathlib import Path
from datetime import datetime, timedelta
from tqdm import tqdm

sys.path.append(str(Path(__file__).parent.parent))
from config.config import RAW_DATA_DIR, AREA_NAME, SOURCE_OPENAQ
from config.data_model import (
    EntityType,
    create_entity_id,
    get_context,
    create_property,
    create_geo_property,
    validate_entity_id
)


def load_openaq_data(filename):
    """
    Load OpenAQ locations JSON file
    
    Args:
        filename: Input filename in raw_data directory
        
    Returns:
        Dict with OpenAQ data
    """
    filepath = Path(RAW_DATA_DIR) / filename
    
    if not filepath.exists():
        raise FileNotFoundError(f"File not found: {filepath}")
    
    print(f"Loading AQI station data from {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    return data


def calculate_aqi_from_pm25(pm25):
    """
    Calculate US EPA AQI from PM2.5 concentration
    
    Args:
        pm25: PM2.5 concentration in µg/m³
        
    Returns:
        AQI value (0-500 scale)
    """
    # US EPA AQI breakpoints for PM2.5
    breakpoints = [
        (0, 12.0, 0, 50),      # Good
        (12.1, 35.4, 51, 100), # Moderate
        (35.5, 55.4, 101, 150), # Unhealthy for Sensitive Groups
        (55.5, 150.4, 151, 200), # Unhealthy
        (150.5, 250.4, 201, 300), # Very Unhealthy
        (250.5, 500.4, 301, 500)  # Hazardous
    ]
    
    for c_low, c_high, i_low, i_high in breakpoints:
        if c_low <= pm25 <= c_high:
            aqi = ((i_high - i_low) / (c_high - c_low)) * (pm25 - c_low) + i_low
            return int(round(aqi))
    
    if pm25 > 500.4:
        return 500
    return 0


def get_air_quality_level(aqi):
    """
    Get air quality level from AQI value
    
    Args:
        aqi: AQI value
        
    Returns:
        String: good, moderate, unhealthyForSensitive, unhealthy, veryUnhealthy, hazardous
    """
    if aqi <= 50:
        return "good"
    elif aqi <= 100:
        return "moderate"
    elif aqi <= 150:
        return "unhealthyForSensitiveGroups"
    elif aqi <= 200:
        return "unhealthy"
    elif aqi <= 300:
        return "veryUnhealthy"
    else:
        return "hazardous"


def generate_synthetic_measurements():
    """
    Generate realistic synthetic air quality measurements for HCMC
    
    Returns:
        Dict with pollutant concentrations
    """
    # Realistic ranges for Ho Chi Minh City (based on historical data)
    pm25 = random.uniform(20, 60)  # Typically moderate to unhealthy
    pm10 = pm25 * random.uniform(1.4, 2.0)  # PM10 usually 1.4-2x PM2.5
    
    # Other pollutants (typical urban values)
    no2 = random.uniform(15, 50)  # µg/m³
    o3 = random.uniform(30, 80)   # µg/m³
    so2 = random.uniform(5, 25)   # µg/m³
    co = random.uniform(0.4, 1.2) # mg/m³
    
    return {
        'pm25': round(pm25, 1),
        'pm10': round(pm10, 1),
        'no2': round(no2, 1),
        'o3': round(o3, 1),
        'so2': round(so2, 1),
        'co': round(co, 2)
    }


def create_station_id(location_name):
    """
    Create a clean station ID from location name
    
    Args:
        location_name: Station name from OpenAQ
        
    Returns:
        Clean ID string
    """
    # Remove special characters and spaces
    clean_name = location_name.lower()
    clean_name = clean_name.replace(':', '')
    clean_name = clean_name.replace(',', '')
    clean_name = clean_name.replace('(', '')
    clean_name = clean_name.replace(')', '')
    clean_name = clean_name.replace(' - ', '-')
    clean_name = clean_name.replace(' ', '-')
    
    # Limit length
    if len(clean_name) > 40:
        clean_name = clean_name[:40]
    
    return clean_name


def transform_location_to_ngsi_ld(location, timestamp=None):
    """
    Transform OpenAQ location to NGSI-LD AirQualityObserved with synthetic data
    
    Args:
        location: OpenAQ location dict
        timestamp: Optional datetime for observation (default: now)
        
    Returns:
        NGSI-LD AirQualityObserved entity or None
    """
    if not location:
        return None
    
    # Get coordinates
    coords = location.get('coordinates', {})
    lon = coords.get('longitude')
    lat = coords.get('latitude')
    
    if not lon or not lat:
        return None
    
    # Get station info
    location_id = location.get('id')
    location_name = location.get('name', f'Station-{location_id}')
    
    # Get timestamp
    if timestamp is None:
        timestamp = datetime.now()
    
    date_observed = timestamp.strftime("%Y-%m-%dT%H:%M:%SZ")
    
    # Create station ID
    station_id = create_station_id(location_name)
    
    # Create entity ID
    entity_id = create_entity_id(
        EntityType.AIR_QUALITY_OBSERVED,
        f"{station_id}-{date_observed.replace(':', '').replace('-', '')}"
    )
    
    if not validate_entity_id(entity_id):
        print(f"[WARNING] Invalid entity ID: {entity_id}")
        return None
    
    # Generate synthetic measurements
    measurements = generate_synthetic_measurements()
    
    # Calculate AQI from PM2.5
    aqi = calculate_aqi_from_pm25(measurements['pm25'])
    aqi_level = get_air_quality_level(aqi)
    
    # Build NGSI-LD entity
    entity = {
        "id": entity_id,
        "type": EntityType.AIR_QUALITY_OBSERVED,
        "@context": get_context(EntityType.AIR_QUALITY_OBSERVED),
        "location": create_geo_property([lon, lat], "Point"),
        "dateObserved": create_property(
            {"@type": "DateTime", "@value": date_observed}
        )
    }
    
    # Add AQI
    entity["aqi"] = create_property(
        aqi,
        observed_at=date_observed
    )
    
    entity["airQualityLevel"] = create_property(aqi_level)
    
    # Add pollutant measurements
    entity["pm25"] = create_property(
        measurements['pm25'],
        unit_code="GQ",  # µg/m³
        observed_at=date_observed
    )
    
    entity["pm10"] = create_property(
        measurements['pm10'],
        unit_code="GQ",
        observed_at=date_observed
    )
    
    entity["no2"] = create_property(
        measurements['no2'],
        unit_code="GQ",
        observed_at=date_observed
    )
    
    entity["o3"] = create_property(
        measurements['o3'],
        unit_code="GQ",
        observed_at=date_observed
    )
    
    entity["so2"] = create_property(
        measurements['so2'],
        unit_code="GQ",
        observed_at=date_observed
    )
    
    entity["co"] = create_property(
        measurements['co'],
        unit_code="GP",  # mg/m³
        observed_at=date_observed
    )
    
    # Metadata
    country = location.get('country', {})
    provider = location.get('provider', {})
    
    entity["name"] = create_property(location_name)
    
    entity["dataProvider"] = create_property(SOURCE_OPENAQ)
    
    entity["source"] = create_property(
        f"OpenAQ location/{location_id} (synthetic measurements)"
    )
    
    entity["address"] = create_property({
        "addressLocality": AREA_NAME,
        "addressCountry": country.get('code', 'VN')
    })
    
    if provider:
        entity["stationCode"] = create_property(f"OPENAQ-{location_id}")
    
    return entity


def transform_all_locations(openaq_data, include_timeseries=False):
    """
    Transform all OpenAQ locations to NGSI-LD entities
    
    Args:
        openaq_data: OpenAQ data dict
        include_timeseries: If True, generate hourly data for last 24h
        
    Returns:
        List of NGSI-LD entities
    """
    data = openaq_data.get('data', {})
    locations = data.get('results', [])
    
    if not locations:
        print("[WARNING] No locations found in OpenAQ data")
        return []
    
    print(f"\nFound {len(locations)} AQI monitoring stations")
    
    if include_timeseries:
        print("Generating 24-hour time series for each station...")
        total = len(locations) * 24
    else:
        print("Generating current observation for each station...")
        total = len(locations)
    
    entities = []
    
    if include_timeseries:
        # Generate hourly data for last 24 hours
        now = datetime.now()
        
        for location in tqdm(locations, desc="Processing stations", unit="stations"):
            for hour in range(24):
                timestamp = now - timedelta(hours=hour)
                entity = transform_location_to_ngsi_ld(location, timestamp)
                
                if entity:
                    entities.append(entity)
        
    else:
        # Generate only current observation
        now = datetime.now()
        
        for location in tqdm(locations, desc="Transforming", unit="stations"):
            entity = transform_location_to_ngsi_ld(location, now)
            
            if entity:
                entities.append(entity)
    
    print(f"\n[OK] Transformed {len(entities)} entities from {len(locations)} locations")
    
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
        "@context": get_context(EntityType.AIR_QUALITY_OBSERVED),
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
    
    print(f"\nTotal entities: {len(entities)}")
    
    # Count by AQI level
    by_level = {}
    aqi_values = []
    pm25_values = []
    
    for entity in entities:
        level = entity.get('airQualityLevel', {}).get('value', 'unknown')
        by_level[level] = by_level.get(level, 0) + 1
        
        if 'aqi' in entity:
            aqi_values.append(entity['aqi']['value'])
        
        if 'pm25' in entity:
            pm25_values.append(entity['pm25']['value'])
    
    if aqi_values:
        print(f"\nAQI Statistics:")
        print(f"  Min: {min(aqi_values)}")
        print(f"  Max: {max(aqi_values)}")
        print(f"  Average: {sum(aqi_values)/len(aqi_values):.1f}")
    
    if pm25_values:
        print(f"\nPM2.5 Statistics (µg/m³):")
        print(f"  Min: {min(pm25_values):.1f}")
        print(f"  Max: {max(pm25_values):.1f}")
        print(f"  Average: {sum(pm25_values)/len(pm25_values):.1f}")
    
    print("\nAir Quality Level Distribution:")
    for level, count in sorted(by_level.items(), key=lambda x: x[1], reverse=True):
        percentage = count / len(entities) * 100
        print(f"  {level:30s}: {count:5d} ({percentage:5.1f}%)")
    
    print("=" * 70)


def validate_sample(entities, sample_size=2):
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
        name = entity.get('name', {}).get('value', 'Unknown Station')
        
        print(f"\n{i}. {entity['id']}")
        try:
            print(f"   Station: {name}")
        except UnicodeEncodeError:
            print(f"   Station: {name.encode('ascii', 'replace').decode('ascii')}")
        
        print(f"   Observed: {entity.get('dateObserved', {}).get('value', {}).get('@value', 'N/A')}")
        
        if 'aqi' in entity:
            aqi = entity['aqi']['value']
            level = entity.get('airQualityLevel', {}).get('value', 'N/A')
            print(f"   AQI: {aqi} ({level})")
        
        if 'pm25' in entity:
            pm25 = entity['pm25']['value']
            print(f"   PM2.5: {pm25} µg/m³")
        
        # Validate structure
        required_fields = ['id', 'type', '@context', 'location', 'dateObserved', 'aqi']
        missing = [f for f in required_fields if f not in entity]
        
        if missing:
            print(f"   [WARNING] Missing required fields: {missing}")
        else:
            print(f"   [OK] All required fields present")


def main():
    """Main execution"""
    print("=" * 70)
    print("UrbanReflex - AQI to NGSI-LD Transformer")
    print("=" * 70)
    print("\nNote: Using synthetic measurements (OpenAQ data is outdated)")
    
    mode = "current"
    if len(sys.argv) > 1:
        mode = sys.argv[1].lower()
    
    try:
        input_file = "openaq_locations_latest.json"
        openaq_data = load_openaq_data(input_file)
        
        if mode == "timeseries":
            # Generate 24-hour time series
            entities = transform_all_locations(openaq_data, include_timeseries=True)
            output_file = "air_quality_observed_timeseries.jsonld"
            latest_file = "air_quality_observed_timeseries_latest.jsonld"
        else:
            # Generate current observations only
            entities = transform_all_locations(openaq_data, include_timeseries=False)
            output_file = "air_quality_observed_current.jsonld"
            latest_file = "air_quality_observed_latest.jsonld"
        
        if not entities:
            print("[ERROR] No valid entities created")
            return 1
        
        # Validate samples
        validate_sample(entities)
        
        # Print statistics
        print_statistics(entities)
        
        # Save output
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        timestamped_file = output_file.replace('.jsonld', f'_{timestamp}.jsonld')
        
        save_entities(entities, timestamped_file)
        save_entities(entities, latest_file)
        
        print(f"\n[SUCCESS] Transformation completed!")
        print(f"\nMode: {mode}")
        print(f"Entities created: {len(entities)}")
        print(f"\nOutput files:")
        print(f"   - ngsi_ld_entities/{timestamped_file}")
        print(f"   - ngsi_ld_entities/{latest_file}")
        
        return 0
        
    except FileNotFoundError as e:
        print(f"[ERROR] {e}")
        print("\nPlease run fetch_aqi_openaq.py first to collect station data.")
        return 1
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit(main())

