"""
Author: Hồ Viết Hiệp
Created at: 2025-11-15
Updated at: 2025-11-22
Description: Transform OpenWeatherMap JSON to NGSI-LD WeatherObserved entities.
             Complies with ETSI NGSI-LD spec and FiWARE Weather Data Model.
"""

import json
import sys
from pathlib import Path
from datetime import datetime, timezone
from tqdm import tqdm

sys.path.append(str(Path(__file__).parent.parent))
from config.config import RAW_DATA_DIR, AREA_NAME, SOURCE_OWM
from config.data_model import (
    EntityType,
    create_entity_id,
    get_context,
    create_property,
    create_geo_property,
    validate_entity_id,
    add_sosa_ssn_types
)


def load_owm_data(filename):
    """
    Load OpenWeatherMap JSON file
    
    Args:
        filename: Input filename in raw_data directory
        
    Returns:
        Dict with OWM data
    """
    filepath = Path(RAW_DATA_DIR) / filename
    
    if not filepath.exists():
        raise FileNotFoundError(f"File not found: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    return data


def timestamp_to_iso(unix_timestamp):
    """
    Convert Unix timestamp to ISO 8601 format
    
    Args:
        unix_timestamp: Unix timestamp (seconds since epoch)
        
    Returns:
        ISO 8601 datetime string with Z suffix
    """
    dt = datetime.utcfromtimestamp(unix_timestamp)
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def transform_current_weather(owm_data):
    """
    Transform OWM current weather to NGSI-LD WeatherObserved
    
    Args:
        owm_data: OWM data dict with 'metadata' and 'data' keys
        
    Returns:
        NGSI-LD WeatherObserved entity or None
    """
    metadata = owm_data.get('metadata', {})
    data = owm_data.get('data', {})
    
    if not data:
        return None
    
    # Get coordinates
    coord = data.get('coord', metadata.get('coordinates', {}))
    lon = coord.get('lon')
    lat = coord.get('lat')
    
    if not lon or not lat:
        return None
    
    # Get observation timestamp
    dt = data.get('dt')
    if not dt:
        return None
    
    date_observed = timestamp_to_iso(dt)
    
    run_timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

    # Create entity ID with run timestamp to retain history
    entity_id = create_entity_id(
        EntityType.WEATHER_OBSERVED,
        f"HCMC-{run_timestamp}"
    )
    
    if not validate_entity_id(entity_id):
        print(f"[WARNING] Invalid entity ID: {entity_id}")
        return None
    
    # Build NGSI-LD entity
    entity = {
        "id": entity_id,
        "type": EntityType.WEATHER_OBSERVED,
        "@context": get_context(EntityType.WEATHER_OBSERVED),
        "location": create_geo_property([lon, lat], "Point"),
        "dateObserved": create_property(
            {"@type": "DateTime", "@value": date_observed}
        )
    }
    
    # Temperature (Celsius)
    main = data.get('main', {})
    if 'temp' in main:
        entity["temperature"] = create_property(
            main['temp'],
            unit_code="CEL",
            observed_at=date_observed
        )
    
    if 'feels_like' in main:
        entity["feelsLikeTemperature"] = create_property(
            main['feels_like'],
            unit_code="CEL",
            observed_at=date_observed
        )
    
    # Humidity (convert from % to 0-1 range)
    if 'humidity' in main:
        humidity_fraction = main['humidity'] / 100.0
        entity["relativeHumidity"] = create_property(
            round(humidity_fraction, 2),
            observed_at=date_observed
        )
    
    # Atmospheric pressure (hPa)
    if 'pressure' in main:
        entity["atmosphericPressure"] = create_property(
            main['pressure'],
            unit_code="A97",
            observed_at=date_observed
        )
    
    # Wind
    wind = data.get('wind', {})
    if 'speed' in wind:
        entity["windSpeed"] = create_property(
            wind['speed'],
            unit_code="MTS",
            observed_at=date_observed
        )
    
    if 'deg' in wind:
        entity["windDirection"] = create_property(
            wind['deg'],
            unit_code="DD",
            observed_at=date_observed
        )
    
    # Clouds (percentage)
    clouds = data.get('clouds', {})
    if 'all' in clouds:
        cloud_fraction = clouds['all'] / 100.0
        entity["cloudCover"] = create_property(
            round(cloud_fraction, 2),
            observed_at=date_observed
        )
    
    # Visibility (meters)
    if 'visibility' in data:
        entity["visibility"] = create_property(
            data['visibility'],
            unit_code="MTR",
            observed_at=date_observed
        )
    
    # Weather description
    weather_list = data.get('weather', [])
    if weather_list and len(weather_list) > 0:
        weather_main = weather_list[0].get('main', '')
        weather_desc = weather_list[0].get('description', '')
        
        entity["weatherType"] = create_property(weather_main.lower())
        entity["weatherDescription"] = create_property(weather_desc)
    
    # Precipitation (if available in rain/snow)
    precipitation = 0
    if 'rain' in data:
        rain_1h = data['rain'].get('1h', 0)
        precipitation += rain_1h
    if 'snow' in data:
        snow_1h = data['snow'].get('1h', 0)
        precipitation += snow_1h
    
    entity["precipitation"] = create_property(
        precipitation,
        unit_code="MMT",
        observed_at=date_observed
    )
    
    # Metadata
    entity["dataProvider"] = create_property(SOURCE_OWM)
    entity["source"] = create_property(f"OWM station/{data.get('id', 'unknown')}")
    entity["address"] = create_property({
        "addressLocality": data.get('name', AREA_NAME),
        "addressCountry": data.get('sys', {}).get('country', 'VN')
    })
    
    # Add SOSA/SSN types for explicit compliance
    entity = add_sosa_ssn_types(entity, EntityType.WEATHER_OBSERVED)
    
    return entity


def transform_forecast_weather(owm_forecast_data):
    """
    Transform OWM 5-day forecast to multiple NGSI-LD WeatherObserved entities
    
    Args:
        owm_forecast_data: OWM forecast data dict
        
    Returns:
        List of NGSI-LD WeatherObserved entities
    """
    metadata = owm_forecast_data.get('metadata', {})
    data = owm_forecast_data.get('data', {})
    
    if not data:
        return []
    
    forecast_list = data.get('list', [])
    if not forecast_list:
        return []
    
    city = data.get('city', {})
    coord = city.get('coord', metadata.get('coordinates', {}))
    lon = coord.get('lon')
    lat = coord.get('lat')
    
    if not lon or not lat:
        return []
    
    entities = []
    
    run_suffix = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

    for item in tqdm(forecast_list, desc="Transforming", unit="forecasts"):
        dt = item.get('dt')
        if not dt:
            continue
        
        date_observed = timestamp_to_iso(dt)
        
        # Create entity ID with forecast timestamp + run suffix
        entity_id = create_entity_id(
            EntityType.WEATHER_OBSERVED,
            f"HCMC-forecast-{date_observed.replace(':', '').replace('-', '')}-{run_suffix}"
        )
        
        if not validate_entity_id(entity_id):
            continue
        
        # Build NGSI-LD entity
        entity = {
            "id": entity_id,
            "type": EntityType.WEATHER_OBSERVED,
            "@context": get_context(EntityType.WEATHER_OBSERVED),
            "location": create_geo_property([lon, lat], "Point"),
            "dateObserved": create_property(
                {"@type": "DateTime", "@value": date_observed}
            )
        }
        
        # Temperature
        main = item.get('main', {})
        if 'temp' in main:
            entity["temperature"] = create_property(
                main['temp'],
                unit_code="CEL",
                observed_at=date_observed
            )
        
        if 'feels_like' in main:
            entity["feelsLikeTemperature"] = create_property(
                main['feels_like'],
                unit_code="CEL",
                observed_at=date_observed
            )
        
        # Humidity
        if 'humidity' in main:
            humidity_fraction = main['humidity'] / 100.0
            entity["relativeHumidity"] = create_property(
                round(humidity_fraction, 2),
                observed_at=date_observed
            )
        
        # Atmospheric pressure
        if 'pressure' in main:
            entity["atmosphericPressure"] = create_property(
                main['pressure'],
                unit_code="A97",
                observed_at=date_observed
            )
        
        # Wind
        wind = item.get('wind', {})
        if 'speed' in wind:
            entity["windSpeed"] = create_property(
                wind['speed'],
                unit_code="MTS",
                observed_at=date_observed
            )
        
        if 'deg' in wind:
            entity["windDirection"] = create_property(
                wind['deg'],
                unit_code="DD",
                observed_at=date_observed
            )
        
        # Clouds
        clouds = item.get('clouds', {})
        if 'all' in clouds:
            cloud_fraction = clouds['all'] / 100.0
            entity["cloudCover"] = create_property(
                round(cloud_fraction, 2),
                observed_at=date_observed
            )
        
        # Visibility
        if 'visibility' in item:
            entity["visibility"] = create_property(
                item['visibility'],
                unit_code="MTR",
                observed_at=date_observed
            )
        
        # Weather description
        weather_list = item.get('weather', [])
        if weather_list and len(weather_list) > 0:
            weather_main = weather_list[0].get('main', '')
            weather_desc = weather_list[0].get('description', '')
            
            entity["weatherType"] = create_property(weather_main.lower())
            entity["weatherDescription"] = create_property(weather_desc)
        
        # Probability of precipitation (forecast specific)
        if 'pop' in item:
            entity["precipitationProbability"] = create_property(
                round(item['pop'], 2),
                observed_at=date_observed
            )
        
        # Precipitation amount
        precipitation = 0
        if 'rain' in item:
            rain_3h = item['rain'].get('3h', 0)
            precipitation += rain_3h / 3.0
        if 'snow' in item:
            snow_3h = item['snow'].get('3h', 0)
            precipitation += snow_3h / 3.0
        
        entity["precipitation"] = create_property(
            round(precipitation, 2),
            unit_code="MMT",
            observed_at=date_observed
        )
        
        # Metadata
        entity["dataProvider"] = create_property(SOURCE_OWM)
        entity["source"] = create_property("OWM 5-day forecast")
        entity["address"] = create_property({
            "addressLocality": city.get('name', AREA_NAME),
            "addressCountry": city.get('country', 'VN')
        })
        
        # Add SOSA/SSN types for explicit compliance
        entity = add_sosa_ssn_types(entity, EntityType.WEATHER_OBSERVED)
        
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
        "@context": get_context(EntityType.WEATHER_OBSERVED),
        "@graph": entities if isinstance(entities, list) else [entities]
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(document, f, indent=2, ensure_ascii=False)
    
    # Also save as NDJSON
    ndjson_path = output_dir / output_file.replace('.jsonld', '.ndjson')
    entity_list = entities if isinstance(entities, list) else [entities]
    
    with open(ndjson_path, 'w', encoding='utf-8') as f:
        for entity in entity_list:
            f.write(json.dumps(entity, ensure_ascii=False) + '\n')




def main():
    """Main execution"""
    mode = "current"
    if len(sys.argv) > 1:
        mode = sys.argv[1].lower()
    
    try:
        if mode == "forecast":
            # Transform forecast data
            input_file = "owm_weather_forecast_latest.json"
            owm_data = load_owm_data(input_file)
            entities = transform_forecast_weather(owm_data)
            
            if not entities:
                print("[ERROR] No valid entities created from forecast")
                return 1
            
            output_file = "weather_observed_forecast.jsonld"
            latest_file = "weather_observed_forecast_latest.jsonld"
            
        else:
            # Transform current weather
            input_file = "owm_weather_latest.json"
            owm_data = load_owm_data(input_file)
            entity = transform_current_weather(owm_data)
            
            if not entity:
                print("[ERROR] Failed to create entity from current weather")
                return 1
            
            entities = entity
            output_file = "weather_observed_current.jsonld"
            latest_file = "weather_observed_latest.jsonld"
        
        # Save output
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        timestamped_file = output_file.replace('.jsonld', f'_{timestamp}.jsonld')
        
        save_entities(entities, timestamped_file)
        save_entities(entities, latest_file)
        
        entity_count = len(entities) if isinstance(entities, list) else 1
        print(f"[SUCCESS] Transformed {entity_count} entities ({mode} mode)")
        
        return 0
        
    except FileNotFoundError as e:
        print(f"[ERROR] {e}")
        print("\nPlease run fetch_weather_owm.py first to collect weather data.")
        return 1
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit(main())

