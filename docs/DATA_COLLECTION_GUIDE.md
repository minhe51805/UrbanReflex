# Data Collection Guide

This document describes the data collection pipeline for UrbanReflex, including data sources, collection scripts, and output formats.

---

## Overview

UrbanReflex collects urban infrastructure data from multiple open data sources:

- **OpenStreetMap** - Road network and Points of Interest
- **OpenWeatherMap** - Real-time weather data
- **OpenAQ** - Air quality measurements
- **Synthetic Data** - Generated streetlight infrastructure

All collected data is stored in standardized formats for transformation to NGSI-LD.

---

## Data Sources

### OpenStreetMap (OSM)

**What:** Crowdsourced geographic database  
**Data types:** Roads, schools, hospitals, parks, parking  
**API:** Overpass API  
**License:** ODbL (Open Database License)  
**Update frequency:** Real-time

**Coverage for HCMC:**
- 4,956 road segments
- 170 Points of Interest (49 schools, 20 hospitals, 81 parks, 20 parking)

### OpenWeatherMap (OWM)

**What:** Weather data service  
**Data types:** Temperature, humidity, wind, pressure, precipitation  
**API:** REST API v2.5  
**License:** CC BY-SA 4.0  
**Update frequency:** Every 10 minutes

**Free tier limits:**
- 1,000 API calls/day
- Current weather + 5-day forecast

### OpenAQ

**What:** Open air quality data platform  
**Data types:** PM2.5, PM10, NO₂, O₃, CO, SO₂  
**API:** REST API v3  
**License:** CC BY 4.0  
**Update frequency:** Hourly

**Coverage for HCMC:**
- 10 monitoring stations
- Located across main districts

### Synthetic Data

**What:** Generated infrastructure data  
**Data types:** Streetlight positions and properties  
**Reason:** OSM lacks streetlight coverage for HCMC  
**Method:** Geometric interpolation along road centerlines

**Parameters:**
- Spacing: 30-50m (randomized)
- Lamp types: LED (60%), HPS (20%), MH (20%)
- Status distribution: Realistic failure rates

---

## Data Collection Scripts

### 1. Download FiWARE Schemas

```bash
python scripts/download_schemas.py
```

Downloads official JSON schemas from [smart-data-models](https://github.com/smart-data-models/) repository:
- `WeatherObserved`
- `AirQualityObserved`
- `Streetlight`
- `StreetlightControlCabinet`
- `PointOfInterest`

**Output:** `schemas/*.json`

---

### 2. Fetch OSM Roads

```bash
python scripts/fetch_osm_roads.py [1|2]
```

Fetches road network from OpenStreetMap Overpass API.

**Arguments:**
- `1` - Full HCMC area (may timeout on slow connections)
- `2` - Central HCMC (recommended, default)

**Road types collected:**
- Primary roads (highways, major streets)
- Secondary roads (district connectors)
- Tertiary roads (local streets)
- Residential roads

**Output:**
- `raw_data/osm_roads_center.json` - GeoJSON format
- Includes road names, types, lanes, surface info

---

### 3. Fetch OSM POIs

```bash
python scripts/fetch_osm_pois.py [1|2]
```

Fetches Points of Interest from OpenStreetMap.

**Categories:**
- **Schools** - Educational facilities
- **Hospitals** - Healthcare facilities
- **Parks** - Green spaces and recreation
- **Parking** - Public parking facilities

**Geometry types:**
- Points (schools, hospitals, parking)
- Polygons (parks, large facilities)

**Output:**
- `raw_data/osm_pois_center.json` - GeoJSON format
- Includes names, addresses, operating hours (if available)

---

### 4. Fetch Weather Data

```bash
# Current weather only
python scripts/fetch_weather_owm.py

# With 5-day forecast
python scripts/fetch_weather_owm.py forecast
```

Fetches weather data from OpenWeatherMap API.

**Metrics collected:**
- Temperature (°C)
- Feels-like temperature
- Atmospheric pressure (hPa)
- Humidity (%)
- Wind speed and direction
- Cloud coverage (%)
- Precipitation (mm)
- Weather conditions (clear, clouds, rain, etc.)

**Forecast data:**
- 40 data points
- 3-hour intervals
- 5-day coverage

**Output:**
- `raw_data/owm_weather_latest.json`
- `raw_data/owm_weather_forecast_latest.json` (if requested)

---

### 5. Fetch Air Quality Data

```bash
python scripts/fetch_aqi_openaq.py
```

Fetches air quality monitoring stations from OpenAQ API.

**Stations in HCMC:**
- US Diplomatic Post (2 locations)
- University sensors
- Community monitoring stations

**Data collected:**
- Station locations (coordinates)
- Available parameters (PM2.5, NO₂, etc.)
- Station metadata

**Output:**
- `raw_data/openaq_locations_latest.json`

**Note:** Measurement data endpoint returned 404 in testing. Script collects station metadata for future use.

---

### 6. Generate Synthetic Streetlights

```bash
python scripts/generate_synthetic_streetlights.py
```

Generates streetlight data from road network.

**Algorithm:**
1. Load road network GeoJSON
2. Filter roads by type (primary, secondary, tertiary, residential)
3. Interpolate points along road centerlines
4. Apply randomized spacing (30-50m)
5. Assign realistic properties

**Properties generated:**
- **Position** - Geographic coordinates
- **Status** - ok (60%), defectiveLamp (20%), brokenLamp (20%)
- **Lamp type** - LED (60%), HPS (20%), Metal Halide (20%)
- **Power rating** - 60-150W based on road type
- **Lantern height** - 8m (major roads), 6m (local roads)
- **Power state** - on/off (for time-based simulation)

**Output:**
- `raw_data/synthetic_streetlights_center_latest.json` - GeoJSON format
- 17,205 streetlight positions from 4,956 roads

---

## Output Data Structure

All data is saved in `raw_data/` directory with two versions:

1. **Timestamped** - `{type}_{timestamp}.json` (archival)
2. **Latest** - `{type}_latest.json` (always current)

### GeoJSON Format (OSM data)

```json
{
  "type": "FeatureCollection",
  "metadata": {
    "generated": "2025-11-15T10:30:00Z",
    "source": "OpenStreetMap Overpass API",
    "area": "Ho Chi Minh City, Vietnam",
    "count": 4956
  },
  "features": [
    {
      "type": "Feature",
      "id": 123456,
      "geometry": {
        "type": "LineString",
        "coordinates": [[106.7, 10.77], [106.71, 10.78]]
      },
      "properties": {
        "osm_id": 123456,
        "name": "Nguyen Hue Street",
        "highway": "primary",
        "lanes": 6
      }
    }
  ]
}
```

### JSON Format (Weather, AQI)

```json
{
  "metadata": {
    "fetched_at": "2025-11-15T10:30:00Z",
    "source": "OpenWeatherMap API",
    "location": "Ho Chi Minh City"
  },
  "data": {
    "temp": 28.5,
    "humidity": 78,
    "wind": {"speed": 3.2, "deg": 150}
  }
}
```

---

## Data Quality

### Roads (OSM)
- **Accuracy:** Community-verified, ~95% complete for major roads
- **Freshness:** Real-time updates from OSM
- **Coverage:** Central HCMC (5km x 5km area)

### POIs (OSM)
- **Accuracy:** Community-verified, updated regularly
- **Completeness:** Public facilities well-covered, private facilities may be incomplete
- **Verification:** Cross-referenced with official sources recommended

### Weather (OWM)
- **Accuracy:** ±1°C temperature, ±5% humidity
- **Forecast:** ~80% accuracy for 3 days, decreasing thereafter
- **Update frequency:** Every 10 minutes

### AQI (OpenAQ)
- **Stations:** 10 in HCMC area (partial coverage)
- **Update frequency:** Hourly
- **Quality:** Varies by station and sensor type

### Streetlights (Synthetic)
- **Accuracy:** Estimated positions, not actual sensor data
- **Purpose:** Demonstration and testing
- **Validation:** Requires field verification for production use

---

## Usage Examples

### Complete Data Collection Pipeline

```bash
# 1. Setup environment
source venv/bin/activate

# 2. Download schemas (once)
python scripts/download_schemas.py

# 3. Collect all data sources
python scripts/fetch_osm_roads.py 2
python scripts/fetch_osm_pois.py 2
python scripts/fetch_weather_owm.py forecast
python scripts/fetch_aqi_openaq.py
python scripts/generate_synthetic_streetlights.py

# 4. Verify output
ls -lh raw_data/
```

### Automated Collection (Cron)

```bash
# Collect weather every hour
0 * * * * /path/to/venv/bin/python /path/to/scripts/fetch_weather_owm.py

# Collect AQI every 2 hours
0 */2 * * * /path/to/venv/bin/python /path/to/scripts/fetch_aqi_openaq.py

# Update roads weekly (Sundays at 2 AM)
0 2 * * 0 /path/to/venv/bin/python /path/to/scripts/fetch_osm_roads.py 2
```

---

## Next Steps

After data collection:

1. **Transform to NGSI-LD** - Use transformation scripts (see `scripts/transform_*.py`)
2. **Validate entities** - Check against FiWARE schemas
3. **Load into Orion-LD** - POST entities to Context Broker
4. **Query and visualize** - Use NGSI-LD API for data access

See transformation and validation documentation for details.

---

## Troubleshooting

### API Rate Limits

If you hit rate limits:
- **OWM:** Free tier = 1,000 calls/day. Reduce polling frequency or upgrade plan.
- **OpenAQ:** No strict limits, but use responsibly. Cache results when possible.
- **OSM Overpass:** May timeout on large queries. Use smaller bounding boxes.

### Timeout Errors

For OSM Overpass timeouts:
- Use option `2` (central area) instead of `1` (full HCMC)
- Script automatically falls back to alternative server
- Reduce bounding box size in `config/config.py` if needed

### Unicode Issues

On Windows terminals:
```bash
# Set UTF-8 encoding
chcp 65001
python scripts/fetch_aqi_openaq.py
```

---

## Data Licenses

Please respect data source licenses:

- **OpenStreetMap:** [ODbL](https://opendatacommons.org/licenses/odbl/) - Share-alike with attribution
- **OpenWeatherMap:** [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- **OpenAQ:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

Always provide attribution when using collected data.

---

## Contributing

To add new data sources:

1. Create script in `scripts/` following naming convention `fetch_{source}.py`
2. Use configuration from `config/config.py`
3. Save output to `raw_data/` with metadata
4. Add example to `examples/` directory
5. Update this documentation
6. Submit pull request with tests

---

## Resources

- [OpenStreetMap Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API)
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [OpenAQ API v3 Docs](https://docs.openaq.org/)
- [FiWARE Data Models](https://github.com/smart-data-models)
