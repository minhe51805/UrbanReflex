# Open Data Export - UrbanReflex

This folder contains exported NGSI-LD entities from the UrbanReflex Context Broker (Orion-LD) in multiple open data formats for reuse and analysis.

---

## Purpose

The `open_data/` directory provides snapshots of UrbanReflex data in standard formats that can be easily consumed by researchers, developers, and data analysis tools without requiring NGSI-LD knowledge.

Exported entity types include:
- `RoadSegment` – road network segments
- `Streetlight` – street lighting infrastructure
- `WeatherObserved` – weather observations
- `AirQualityObserved` – air quality measurements
- `PointOfInterest` – schools, hospitals, parks, and other facilities
- `CitizenReport` – anonymized citizen reports about infrastructure issues

---

## File Formats

Each entity type is exported in three formats:

**NDJSON** (Newline Delimited JSON)
- One entity per line
- Preserves full NGSI-LD structure
- Best for programmatic processing

**CSV** (Comma Separated Values)
- Flattened structure for spreadsheet and database import
- Nested objects are flattened (e.g., `location_lon`, `location_lat`)

**GeoJSON** (Geographic JSON)
- Standard format for geographic data visualization
- Compatible with mapping tools (QGIS, Leaflet, etc.)
- Only entities with `location` property are included

---

## Privacy & Anonymization

**CitizenReport** entities have been anonymized before export:
- Removed: `reporterName`, `reporterContact`
- Preserved: All other fields (location, description, category, priority, status)

---

## Usage Examples

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

## Regenerating the Snapshot

To regenerate this snapshot, run:

```bash
python scripts/export_open_data.py
```

This will export all entity types from Orion-LD to the `open_data/` directory in the three formats listed above.

---

## Related Documentation

- **Project README:** `../README.md`
- **Export Script:** `../scripts/export_open_data.py`
- **Data Model:** `../docs/DATA_MODEL_AND_ENTITIES.md`

---

**Note:** This snapshot represents the state of the UrbanReflex data platform at the time of export. For real-time data, please use the NGSI-LD API endpoints documented in the project README.
