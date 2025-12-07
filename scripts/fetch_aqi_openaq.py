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
from pathlib import Path
from datetime import datetime, timedelta, timezone

# Import config
import sys
sys.path.append(str(Path(__file__).parent.parent))
from config.config import (
    OPENAQ_API_KEY,
    OPENAQ_BASE_URL,
    OPENAQ_RADIUS,
    HCMC_CENTER,
    RAW_DATA_DIR,
    AREA_NAME,
    SOURCE_OPENAQ
)


FRESHNESS_HOURS = 48


def fetch_locations_near_hcmc(api_key, lat, lon, radius=25000):
    """
    Fetch air quality monitoring locations near HCMC
    
    Args:
        api_key: OpenAQ API key
        lat: Latitude of HCMC center
        lon: Longitude of HCMC center
        radius: Search radius in meters (max 25000)
        
    Returns:
        Dict with locations data or None if failed
    """
    endpoint = f"{OPENAQ_BASE_URL}/locations"
    
    headers = {
        "X-API-Key": api_key,
        "Accept": "application/json"
    }
    
    params = {
        "coordinates": f"{lat},{lon}",
        "radius": radius,
        "limit": 100
    }
    
    print(f"Fetching air quality monitoring stations from OpenAQ API v3...")
    
    try:
        response = requests.get(endpoint, headers=headers, params=params, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        
        locations = data.get('results', [])
        print(f"[OK] Found {len(locations)} monitoring stations")
        
        return data
        
    except requests.RequestException as e:
        print(f"[ERROR] Request failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                print(f"[ERROR] API response: {error_data}")
            except:
                print(f"[ERROR] Response text: {e.response.text}")
        return None
    except json.JSONDecodeError as e:
        print(f"[ERROR] Failed to parse JSON response: {e}")
        return None


def fetch_latest_measurements(api_key, location_id):
    """
    Fetch latest measurements for a specific location (legacy, unused)
    
    Args:
        api_key: OpenAQ API key
        location_id: Location ID from OpenAQ
        
    Returns:
        Dict with measurements or None if failed
    """
    endpoint = f"{OPENAQ_BASE_URL}/locations/{location_id}"
    
    headers = {
        "X-API-Key": api_key,
        "Accept": "application/json"
    }
    
    try:
        response = requests.get(endpoint, headers=headers, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        return data.get('results', [])
        
    except requests.RequestException as e:
        print(f"[WARNING] Failed to fetch measurements for location {location_id}: {e}")
        return None


def fetch_all_latest_measurements(api_key, limit=1000):
    """
    Fetch latest measurements from all stations
    
    Args:
        api_key: OpenAQ API key
        limit: Max number of measurements to fetch
        
    Returns:
        Dict with latest measurements or None if failed
    """
    endpoint = f"{OPENAQ_BASE_URL}/latest"
    
    headers = {
        "X-API-Key": api_key,
        "Accept": "application/json"
    }
    
    params = {
        "coordinates": f"{HCMC_CENTER['lat']},{HCMC_CENTER['lon']}",
        "radius": OPENAQ_RADIUS,
        "limit": limit
    }
    
    print(f"\nFetching latest measurements from all stations...")
    
    try:
        response = requests.get(endpoint, headers=headers, params=params, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        
        results = data.get('results', [])
        print(f"[OK] Retrieved {len(results)} latest measurements")
        
        return data
        
    except requests.RequestException as e:
        print(f"[ERROR] Request failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                print(f"[ERROR] API response: {error_data}")
            except:
                pass
        return None
    except json.JSONDecodeError as e:
        print(f"[ERROR] Failed to parse JSON response: {e}")
        return None


def fetch_location_sensors(api_key, location_id):
    """
    Fetch sensors metadata for a specific location

    Args:
        api_key: OpenAQ API key
        location_id: Location ID

    Returns:
        List of sensors (possibly empty)
    """
    endpoint = f"{OPENAQ_BASE_URL}/locations/{location_id}/sensors"

    headers = {
        "X-API-Key": api_key,
        "Accept": "application/json"
    }

    try:
        response = requests.get(endpoint, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        return data.get('results', [])
    except requests.RequestException as e:
        print(f"[WARNING] Failed to fetch sensors for location {location_id}: {e}")
        return []


def fetch_sensor_latest_measurement(api_key, sensor_id, freshness_hours=FRESHNESS_HOURS):
    """
    Fetch the latest measurement for a sensor within freshness window

    Args:
        api_key: OpenAQ API key
        sensor_id: Sensor ID
        freshness_hours: Acceptable age of measurement

    Returns:
        Dict with measurement info or None
    """
    endpoint = f"{OPENAQ_BASE_URL}/sensors/{sensor_id}/measurements"

    headers = {
        "X-API-Key": api_key,
        "Accept": "application/json"
    }

    params = {
        "limit": 1,
        "sort": "desc"
    }

    if freshness_hours:
        since = datetime.now(timezone.utc) - timedelta(hours=freshness_hours)
        params["datetime_from"] = since.isoformat().replace("+00:00", "Z")

    try:
        response = requests.get(endpoint, headers=headers, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        results = data.get('results', [])

        if not results:
            return None

        measurement = results[0]
        value = measurement.get('value')
        if value is None or value == -999:
            return None

        parameter = measurement.get('parameter', {})
        period = measurement.get('period', {})
        observed_at = (
            period.get('datetimeTo', {}).get('utc')
            or period.get('datetimeFrom', {}).get('utc')
        )

        return {
            "sensor_id": sensor_id,
            "parameter": parameter.get('name'),
            "unit": parameter.get('units'),
            "value": value,
            "observed_at": observed_at
        }
    except requests.RequestException as e:
        print(f"[WARNING] Failed to fetch measurement for sensor {sensor_id}: {e}")
        return None


def build_latest_measurement_map(api_key, locations):
    """
    Build mapping of location -> latest measurements by parameter

    Args:
        api_key: OpenAQ API key
        locations: List of location dicts

    Returns:
        Dict {location_id: {parameter_name: measurement_dict}}
    """
    measurements_by_location = {}

    for location in locations:
        location_id = location.get('id')
        if not location_id:
            continue

        sensors = fetch_location_sensors(api_key, location_id)
        if not sensors:
            continue

        measurements = {}
        for sensor in sensors:
            sensor_id = sensor.get('id')
            parameter = sensor.get('parameter', {}).get('name')
            if not sensor_id or not parameter:
                continue

            measurement = fetch_sensor_latest_measurement(api_key, sensor_id)
            if measurement:
                measurements[parameter] = measurement

        if measurements:
            measurements_by_location[location_id] = measurements

    return measurements_by_location


def enrich_data(data, data_type="locations"):
    """
    Add metadata to fetched data
    
    Args:
        data: Raw data from API
        data_type: Type of data (locations, measurements, latest)
        
    Returns:
        Enhanced data with metadata
    """
    enhanced = {
        "metadata": {
            "fetched_at": datetime.now(datetime.UTC).isoformat() if hasattr(datetime, 'UTC') else datetime.utcnow().isoformat() + "Z",
            "source": SOURCE_OPENAQ,
            "data_type": data_type,
            "location": HCMC_CENTER['name'],
            "coordinates": {
                "lat": HCMC_CENTER['lat'],
                "lon": HCMC_CENTER['lon']
            },
            "radius_km": OPENAQ_RADIUS / 1000
        },
        "data": data
    }
    
    return enhanced


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


def print_locations_summary(locations_data):
    """
    Print formatted summary of monitoring stations
    
    Args:
        locations_data: Locations data from API
    """
    print("\n" + "=" * 70)
    print("MONITORING STATIONS SUMMARY:")
    print("=" * 70)
    
    try:
        results = locations_data.get('data', {}).get('results', [])
        
        if not results:
            print("No stations found")
            return
        
        for i, location in enumerate(results, 1):
            name = location.get('name', 'Unknown')
            location_id = location.get('id', 'N/A')
            coords = location.get('coordinates', {})
            lat = coords.get('latitude', 'N/A')
            lon = coords.get('longitude', 'N/A')
            
            parameters = location.get('parameters', [])
            param_names = [p.get('parameter', {}).get('name', 'N/A') for p in parameters]
            
            try:
                print(f"\n{i}. {name}")
            except UnicodeEncodeError:
                print(f"\n{i}. {name.encode('ascii', 'replace').decode('ascii')}")
            
            print(f"   ID: {location_id}")
            print(f"   Coordinates: ({lat}, {lon})")
            print(f"   Parameters: {', '.join(param_names) if param_names else 'N/A'}")
        
        print("\n" + "=" * 70)
        
    except (KeyError, TypeError) as e:
        print(f"[WARNING] Could not parse locations data: {e}")


def print_measurements_summary(measurements_data):
    """
    Print formatted summary of latest measurements
    
    Args:
        measurements_data: Latest measurements data from API
    """
    print("\n" + "=" * 70)
    print("LATEST MEASUREMENTS SUMMARY:")
    print("=" * 70)
    
    try:
        results = measurements_data.get('data', {}).get('results', [])
        
        if not results:
            print("No measurements found")
            return
        
        # Group by location
        by_location = {}
        for measurement in results:
            location_name = measurement.get('location', {}).get('name', 'Unknown')
            if location_name not in by_location:
                by_location[location_name] = []
            by_location[location_name].append(measurement)
        
        for location_name, measurements in by_location.items():
            try:
                print(f"\n{location_name}:")
            except UnicodeEncodeError:
                print(f"\n{location_name.encode('ascii', 'replace').decode('ascii')}:")
            
            for m in measurements:
                parameter = m.get('parameter', {}).get('name', 'Unknown')
                value = m.get('value', 'N/A')
                unit = m.get('parameter', {}).get('units', '')
                datetime_str = m.get('datetime', {}).get('utc', 'N/A')
                
                print(f"   {parameter:10s}: {value:8} {unit:10s} (at {datetime_str})")
        
        print("\n" + "=" * 70)
        print(f"Total: {len(results)} measurements from {len(by_location)} stations")
        print("=" * 70)
        
    except (KeyError, TypeError) as e:
        print(f"[WARNING] Could not parse measurements data: {e}")


def main():
    """Main execution"""
    print("=" * 70)
    print("UrbanReflex - OpenAQ Air Quality Fetcher")
    print("=" * 70)
    
    # Get HCMC coordinates
    lat = HCMC_CENTER['lat']
    lon = HCMC_CENTER['lon']
    
    # Fetch locations
    locations_data = fetch_locations_near_hcmc(OPENAQ_API_KEY, lat, lon, OPENAQ_RADIUS)
    
    if locations_data is None:
        print("\n[ERROR] Failed to fetch monitoring stations")
        return 1
    
    # Enrich with metadata
    enhanced_locations = enrich_data(locations_data, "locations")
    
    # Prepare filenames
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    locations_filename = f"openaq_locations_{timestamp}.json"
    
    # Print locations summary
    print_locations_summary(enhanced_locations)
    
    # Build latest measurement map
    try:
        locations = locations_data.get('results', [])
    except AttributeError:
        locations = []

    measurement_map = build_latest_measurement_map(OPENAQ_API_KEY, locations)
    total_real = sum(1 for loc in locations if loc.get('id') in measurement_map)

    for location in locations:
        loc_id = location.get('id')
        location['latestMeasurements'] = measurement_map.get(loc_id, {})

    print(f"\n[SAVING] Monitoring stations data...")
    save_data(enhanced_locations, locations_filename)
    save_data(enhanced_locations, "openaq_locations_latest.json")

    print(f"\n[INFO] Locations with real measurements: {total_real}/{len(locations)}")

    print(f"\n[SUCCESS] Air quality data fetched!")
    print(f"\nOutput files:")
    print(f"   - {RAW_DATA_DIR}/{locations_filename}")
    print(f"   - {RAW_DATA_DIR}/openaq_locations_latest.json")
    
    return 0


if __name__ == "__main__":
    exit(main())

