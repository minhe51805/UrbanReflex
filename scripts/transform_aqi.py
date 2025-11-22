"""
Author: Hồ Viết Hiệp
Created at: 2025-11-15
Updated at: 2025-11-22
Description: Transform OpenAQ location data to NGSI-LD AirQualityObserved entities.
             Uses synthetic measurements since OpenAQ data for HCMC is outdated.
             Complies with ETSI NGSI-LD spec and FiWARE Environment Data Model.
             Generates fixed entity IDs for proper upsert operations.
"""

import json
import sys
import random
import unicodedata
from pathlib import Path
from datetime import datetime, timedelta, timezone
from tqdm import tqdm

sys.path.append(str(Path(__file__).parent.parent))
from config.config import RAW_DATA_DIR, AREA_NAME, SOURCE_OPENAQ
REAL_DATA_MAX_AGE_HOURS = 48

from config.data_model import (
    EntityType,
    create_entity_id,
    get_context,
    create_property,
    create_geo_property,
    validate_entity_id,
    add_sosa_ssn_types
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


def generate_synthetic_measurements(pm25_override=None):
    """
    Generate realistic synthetic air quality measurements for HCMC
    
    Returns:
        Dict with pollutant concentrations
    """
    # Realistic ranges for Ho Chi Minh City (based on historical data)
    pm25 = pm25_override if pm25_override is not None else random.uniform(20, 60)
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
    # Normalize to ASCII
    normalized = unicodedata.normalize('NFD', location_name)
    stripped = ''.join(ch for ch in normalized if unicodedata.category(ch) != 'Mn')
    clean_name = stripped.encode('ascii', 'ignore').decode('ascii')

    # Remove special characters and spaces
    clean_name = clean_name.lower()
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


def parse_iso_datetime(value):
    if not value:
        return None
    try:
        if value.endswith("Z"):
            value = value[:-1] + "+00:00"
        return datetime.fromisoformat(value)
    except ValueError:
        return None


def is_recent_datetime(value, max_age_hours=REAL_DATA_MAX_AGE_HOURS):
    dt = parse_iso_datetime(value)
    if not dt:
        return False
    now = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return (now - dt) <= timedelta(hours=max_age_hours)


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
    # Always use current time for dateObserved (ensure fresh timestamp)
    if timestamp is None:
        timestamp = datetime.now(timezone.utc)
    else:
        # Ensure timestamp has timezone
        if timestamp.tzinfo is None:
            timestamp = timestamp.replace(tzinfo=timezone.utc)
    
    date_observed = timestamp.strftime("%Y-%m-%dT%H:%M:%SZ")
    observed_at = date_observed  # Use same timestamp for observed_at
    
    # Create station ID
    station_id = create_station_id(location_name)
    
    # Create entity ID
    entity_id = create_entity_id(
        EntityType.AIR_QUALITY_OBSERVED,
        f"{station_id}"
    )
    
    if not validate_entity_id(entity_id):
        print(f"[WARNING] Invalid entity ID: {entity_id}")
        return None
    
    valid_measurements = {}
    latest_measurements = location.get('latestMeasurements', {})
    if isinstance(latest_measurements, dict):
        for param, measurement in latest_measurements.items():
            observed_at = measurement.get('observed_at')
            if is_recent_datetime(observed_at):
                valid_measurements[param] = measurement

    pm25_real = valid_measurements.get('pm25')
    measurement_quality = "synthetic"
    measurement_source = f"OpenAQ location/{location_id} (synthetic fallback)"
    # Always use current timestamp for dateObserved (not old measurement time)
    observed_at = date_observed  # Use current timestamp, not old measurement time
    pm25_override = None

    if pm25_real:
        pm25_override = pm25_real.get('value')
        # Keep observed_at as current time (date_observed) for consistency
        # Only use real measurement value, not old timestamp
        observed_at = date_observed  # Always use current timestamp
        measurement_quality = "measured"
        sensor_id = pm25_real.get('sensor_id')
        measurement_source = f"OpenAQ sensor/{sensor_id}" if sensor_id else "OpenAQ sensor (measured)"

    # Generate measurements (real pm25 will override)
    measurements = generate_synthetic_measurements(pm25_override=pm25_override)

    # Override other pollutants if real data exists
    for parameter, measurement in valid_measurements.items():
        if parameter == 'pm25':
            continue
        value = measurement.get('value')
        if value is not None:
            measurements[parameter] = round(value, 1)

    # Calculate AQI from PM2.5
    aqi = calculate_aqi_from_pm25(measurements['pm25'])
    aqi_level = get_air_quality_level(aqi)
    
    # Build NGSI-LD entity
    observed_value = {"@type": "DateTime", "@value": observed_at}

    entity = {
        "id": entity_id,
        "type": EntityType.AIR_QUALITY_OBSERVED,
        "@context": get_context(EntityType.AIR_QUALITY_OBSERVED),
        "location": create_geo_property([lon, lat], "Point"),
        "dateObserved": create_property(observed_value)
    }
    
    # Add AQI
    entity["aqi"] = create_property(
        aqi,
        observed_at=observed_at
    )
    
    entity["airQualityLevel"] = create_property(aqi_level)
    
    # Add pollutant measurements
    entity["pm25"] = create_property(
        measurements['pm25'],
        unit_code="GQ",  # µg/m³
        observed_at=observed_at
    )
    
    entity["pm10"] = create_property(
        measurements['pm10'],
        unit_code="GQ",
        observed_at=observed_at
    )
    
    entity["no2"] = create_property(
        measurements['no2'],
        unit_code="GQ",
        observed_at=observed_at
    )
    
    entity["o3"] = create_property(
        measurements['o3'],
        unit_code="GQ",
        observed_at=observed_at
    )
    
    entity["so2"] = create_property(
        measurements['so2'],
        unit_code="GQ",
        observed_at=observed_at
    )
    
    entity["co"] = create_property(
        measurements['co'],
        unit_code="GP",  # mg/m³
        observed_at=observed_at
    )
    
    # Metadata
    country = location.get('country', {})
    provider = location.get('provider', {})
    
    entity["name"] = create_property(location_name)
    
    entity["dataProvider"] = create_property(SOURCE_OPENAQ)
    
    entity["source"] = create_property(measurement_source)
    entity["measurementQuality"] = create_property(measurement_quality, observed_at=observed_at)
    
    entity["address"] = create_property({
        "addressLocality": AREA_NAME,
        "addressCountry": country.get('code', 'VN')
    })
    
    if provider:
        entity["stationCode"] = create_property(f"OPENAQ-{location_id}")
    
    # Add SOSA/SSN types for explicit compliance
    entity = add_sosa_ssn_types(entity, EntityType.AIR_QUALITY_OBSERVED)
    
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
    
    # Also save as NDJSON
    ndjson_path = output_dir / output_file.replace('.jsonld', '.ndjson')
    
    with open(ndjson_path, 'w', encoding='utf-8') as f:
        for entity in entities:
            f.write(json.dumps(entity, ensure_ascii=False) + '\n')




def main():
    """Main execution"""
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
        
        # Save output
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        timestamped_file = output_file.replace('.jsonld', f'_{timestamp}.jsonld')
        
        save_entities(entities, timestamped_file)
        save_entities(entities, latest_file)
        
        print(f"[SUCCESS] Transformed {len(entities)} entities ({mode} mode)")
        
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

