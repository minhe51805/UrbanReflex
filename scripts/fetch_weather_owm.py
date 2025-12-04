"""
Author: Hồ Viết Hiệp
Created at: 2025-11-15
Updated at: 2025-11-16
Describe: Fetch real-time weather data from OpenWeatherMap API for HCMC.
         Retrieves temperature, humidity, pressure, wind, and precipitation data.
"""

import requests
import json
from pathlib import Path
from datetime import datetime

# Import config
import sys
sys.path.append(str(Path(__file__).parent.parent))
from config.config import (
    OWM_API_KEY,
    OWM_BASE_URL,
    OWM_UNITS,
    HCMC_CENTER,
    RAW_DATA_DIR,
    SOURCE_OWM
)


def fetch_current_weather(lat, lon, api_key, units="metric"):
    """
    Fetch current weather data from OpenWeatherMap
    
    Args:
        lat: Latitude
        lon: Longitude
        api_key: OpenWeatherMap API key
        units: Units of measurement (metric, imperial, standard)
        
    Returns:
        Dict with weather data or None if failed
    """
    endpoint = f"{OWM_BASE_URL}/weather"
    
    params = {
        "lat": lat,
        "lon": lon,
        "appid": api_key,
        "units": units
    }
    
    print(f"Fetching weather data from OpenWeatherMap API...")
    
    try:
        response = requests.get(endpoint, params=params, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        
        print(f"[OK] Weather data retrieved successfully")
        print(f"     Temperature: {data['main']['temp']}°C")
        print(f"     Humidity: {data['main']['humidity']}%")
        print(f"     Conditions: {data['weather'][0]['description']}")
        
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
    except KeyError as e:
        print(f"[ERROR] Unexpected response format, missing key: {e}")
        return None


def fetch_forecast_weather(lat, lon, api_key, units="metric"):
    """
    Fetch 5-day weather forecast from OpenWeatherMap
    
    Args:
        lat: Latitude
        lon: Longitude
        api_key: OpenWeatherMap API key
        units: Units of measurement (metric, imperial, standard)
        
    Returns:
        Dict with forecast data or None if failed
    """
    endpoint = f"{OWM_BASE_URL}/forecast"
    
    params = {
        "lat": lat,
        "lon": lon,
        "appid": api_key,
        "units": units
    }
    
    print(f"\nFetching 5-day forecast from OpenWeatherMap API...")
    
    try:
        response = requests.get(endpoint, params=params, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        
        forecast_count = len(data.get('list', []))
        print(f"[OK] Forecast data retrieved successfully")
        print(f"     Forecast points: {forecast_count}")
        
        return data
        
    except requests.RequestException as e:
        print(f"[ERROR] Request failed: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"[ERROR] Failed to parse JSON response: {e}")
        return None


def enrich_weather_data(weather_data):
    """
    Add metadata and processing timestamp to weather data
    
    Args:
        weather_data: Raw weather data from API
        
    Returns:
        Enhanced weather data with metadata
    """
    enhanced = {
        "metadata": {
            "fetched_at": datetime.now(datetime.UTC).isoformat() if hasattr(datetime, 'UTC') else datetime.utcnow().isoformat() + "Z",
            "source": SOURCE_OWM,
            "location": HCMC_CENTER['name'],
            "coordinates": {
                "lat": HCMC_CENTER['lat'],
                "lon": HCMC_CENTER['lon']
            }
        },
        "data": weather_data
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


def print_weather_summary(weather_data):
    """
    Print formatted weather summary
    
    Args:
        weather_data: Weather data from API
    """
    print("\n" + "=" * 70)
    print("WEATHER SUMMARY:")
    print("=" * 70)
    
    try:
        main = weather_data['main']
        weather = weather_data['weather'][0]
        wind = weather_data.get('wind', {})
        clouds = weather_data.get('clouds', {})
        rain = weather_data.get('rain', {})
        
        print(f"\nConditions: {weather['main']} - {weather['description']}")
        print(f"\nTemperature:")
        print(f"  Current:    {main['temp']}°C")
        print(f"  Feels like: {main['feels_like']}°C")
        print(f"  Min:        {main.get('temp_min', 'N/A')}°C")
        print(f"  Max:        {main.get('temp_max', 'N/A')}°C")
        
        print(f"\nAtmospheric:")
        print(f"  Pressure:   {main['pressure']} hPa")
        print(f"  Humidity:   {main['humidity']}%")
        
        print(f"\nWind:")
        print(f"  Speed:      {wind.get('speed', 'N/A')} m/s")
        print(f"  Direction:  {wind.get('deg', 'N/A')}°")
        
        print(f"\nClouds:       {clouds.get('all', 'N/A')}%")
        
        if rain:
            print(f"\nRain:")
            if '1h' in rain:
                print(f"  Last 1h:    {rain['1h']} mm")
            if '3h' in rain:
                print(f"  Last 3h:    {rain['3h']} mm")
        
        print("=" * 70)
        
    except (KeyError, TypeError) as e:
        print(f"[WARNING] Could not parse weather data for summary: {e}")


def main():
    """Main execution"""
    print("=" * 70)
    print("UrbanReflex - OpenWeatherMap Weather Fetcher")
    print("=" * 70)
    
    # Get HCMC coordinates
    lat = HCMC_CENTER['lat']
    lon = HCMC_CENTER['lon']
    
    # Check for command-line argument to fetch forecast
    import sys
    fetch_forecast = len(sys.argv) > 1 and sys.argv[1].lower() in ['forecast', 'f']
    
    # Fetch current weather
    weather_data = fetch_current_weather(lat, lon, OWM_API_KEY, OWM_UNITS)
    
    if weather_data is None:
        print("\n[ERROR] Failed to fetch weather data")
        return 1
    
    # Enrich with metadata
    enhanced_data = enrich_weather_data(weather_data)
    
    # Save current weather
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"owm_weather_current_{timestamp}.json"
    
    print(f"\n[SAVING] Weather data...")
    save_data(enhanced_data, filename)
    
    # Also save as latest
    save_data(enhanced_data, "owm_weather_latest.json")
    
    # Print summary
    print_weather_summary(weather_data)
    
    # Optionally fetch forecast
    if fetch_forecast:
        forecast_data = fetch_forecast_weather(lat, lon, OWM_API_KEY, OWM_UNITS)
        
        if forecast_data:
            enhanced_forecast = enrich_weather_data(forecast_data)
            forecast_filename = f"owm_weather_forecast_{timestamp}.json"
            
            print(f"\n[SAVING] Forecast data...")
            save_data(enhanced_forecast, forecast_filename)
            save_data(enhanced_forecast, "owm_weather_forecast_latest.json")
            
            print(f"\n[SUCCESS] Weather and forecast data fetched!")
            print(f"\nOutput files:")
            print(f"   - {RAW_DATA_DIR}/{filename}")
            print(f"   - {RAW_DATA_DIR}/owm_weather_latest.json")
            print(f"   - {RAW_DATA_DIR}/{forecast_filename}")
            print(f"   - {RAW_DATA_DIR}/owm_weather_forecast_latest.json")
        else:
            print("\n[WARNING] Forecast fetch failed, but current weather saved")
            print(f"\nOutput files:")
            print(f"   - {RAW_DATA_DIR}/{filename}")
            print(f"   - {RAW_DATA_DIR}/owm_weather_latest.json")
    else:
        print(f"\n[SUCCESS] Weather data fetched!")
        print(f"\nOutput files:")
        print(f"   - {RAW_DATA_DIR}/{filename}")
        print(f"   - {RAW_DATA_DIR}/owm_weather_latest.json")
        print(f"\nTip: Run with 'forecast' argument to also fetch 5-day forecast")
    
    return 0


if __name__ == "__main__":
    exit(main())

