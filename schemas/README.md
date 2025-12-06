# schemas/ – JSON Schema validation files

This directory contains JSON Schema files from [FiWARE Smart Data Models](https://smartdatamodels.org/) used to validate NGSI-LD entities before seeding them into Orion-LD.

---

## Purpose

These schemas ensure that all NGSI-LD entities comply with the official FiWARE Smart Data Models specifications, maintaining data quality and interoperability.

---

## Available Schemas

- `AirQualityObserved_schema.json` – validates air quality observation entities
- `PointOfInterest_schema.json` – validates POI entities (schools, hospitals, parks, etc.)
- `Streetlight_schema.json` – validates streetlight entities
- `StreetlightControlCabinet_schema.json` – validates streetlight control cabinet entities
- `WeatherObserved_schema.json` – validates weather observation entities

---

## Usage

Schemas are automatically used by `scripts/validate_entities.py` to validate entities before seeding:

```bash
python scripts/validate_entities.py
```

---

## Updating Schemas

To download or refresh schemas from FiWARE Smart Data Models repository:

```bash
python scripts/download_schemas.py
```

This script fetches the latest schema versions and saves them to this directory.

---

## Related Documentation

- **Validation Script:** `../scripts/validate_entities.py`
- **Download Script:** `../scripts/download_schemas.py`
- **Data Model:** `../docs/DATA_MODEL_AND_ENTITIES.md`
- **FiWARE Smart Data Models:** https://smartdatamodels.org/

