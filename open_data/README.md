# Open Data Export - UrbanReflex

**Author:** Hồ Viết Hiệp  
**Created at:** 2025-11-27  
**Updated at:** 2025-11-27

---

## 📊 Dataset Overview

This folder contains a **snapshot** of all NGSI-LD entities exported from the UrbanReflex Context Broker (Orion-LD) on **November 27, 2025**.

### Entity Types & Counts

| Entity Type | Count | Formats Available |
|------------|-------|-------------------|
| RoadSegment | 4,936 | NDJSON, CSV, GeoJSON |
| Streetlight | 17,172 | NDJSON, CSV, GeoJSON |
| WeatherObserved | 486 | NDJSON, CSV, GeoJSON |
| AirQualityObserved | 29 | NDJSON, CSV, GeoJSON |
| PointOfInterest | 89 | NDJSON, CSV, GeoJSON |
| CitizenReport | 1 | NDJSON, CSV, GeoJSON |

**Total:** 22,713 entities

---

## 📁 File Formats

Each entity type is exported in three formats:

1. **NDJSON** (Newline Delimited JSON)
   - One entity per line
   - Preserves full NGSI-LD structure
   - Best for programmatic processing

2. **CSV** (Comma Separated Values)
   - Flattened structure
   - Easy to import into Excel, databases
   - Nested objects are flattened (e.g., `location_lon`, `location_lat`)

3. **GeoJSON** (Geographic JSON)
   - Standard format for geographic data
   - Compatible with mapping tools (QGIS, Leaflet, etc.)
   - Only entities with `location` property are included

---

## 🔒 Privacy & Anonymization

**CitizenReport** entities have been **anonymized** before export:
- Removed: `reporterName`, `reporterContact`
- Preserved: All other fields (location, description, category, priority, status)

---

## 📅 Update Frequency

**For Competition/Demo:**
- This is a **one-time snapshot** committed to Git for demonstration purposes.

**For Production:**
- Data should be updated via automated cron jobs on a web server
- Do NOT commit updated data to Git (repo will bloat)
- Recommended: Set up a public web server with scheduled exports

---

## 🚀 Usage Examples

### Load NDJSON
```python
import json

with open('RoadSegment.ndjson', 'r', encoding='utf-8') as f:
    for line in f:
        entity = json.loads(line)
        print(entity['id'], entity['name'])
```

### Load GeoJSON
```python
import json

with open('RoadSegment.geojson', 'r', encoding='utf-8') as f:
    geojson = json.load(f)
    print(f"Total features: {len(geojson['features'])}")
```

### Load CSV
```python
import pandas as pd

df = pd.read_csv('RoadSegment.csv')
print(df.head())
```

---

## 📝 Data Source

- **Context Broker:** Orion-LD v1.5.1
- **Server:** VPS (103.178.233.233:1026)
- **Export Date:** 2025-11-27
- **Export Script:** `scripts/export_open_data.py`

---

## 📄 License

This data is provided as **Open Data** for research, development, and public use. Please refer to the main project LICENSE file for terms of use.

---

## 🔗 Related Documentation

- **Project README:** `../README.md`
- **Export Script:** `../scripts/export_open_data.py`
- **Data Model:** `../docs/` (various documentation files)

---

**Note:** This snapshot represents the state of the UrbanReflex data platform at the time of export. For real-time data, please use the NGSI-LD API endpoints documented in the project README.

