# examples/ – NGSI-LD entity examples

This directory contains example NGSI-LD entities for each entity type used in UrbanReflex. These examples serve as reference templates and demonstrate the structure and properties of each entity type.

---

## Purpose

Use these examples to:
- Understand the structure of each entity type
- Reference property names and data types
- Test entity creation and validation
- Learn NGSI-LD entity formatting

---

## Available Examples

- `example_air_quality_observed.json` – AirQualityObserved entity example
- `example_citizen_report.json` – CitizenReport entity example
- `example_point_of_interest.json` – PointOfInterest entity example
- `example_road_segment.json` – RoadSegment entity example
- `example_streetlight.json` – Streetlight entity example
- `example_weather_observed.json` – WeatherObserved entity example

---

## Usage

### View an example

```bash
cat examples/example_weather_observed.json | python -m json.tool
```

### Use in code

```python
import json

with open('examples/example_weather_observed.json', 'r') as f:
    example = json.load(f)
    print(example['id'])
```

---

## Entity Structure

All examples follow the NGSI-LD standard:
- `id` – unique entity identifier (URN format)
- `type` – entity type name
- `@type` – semantic types (e.g., `sosa:Observation`)
- `@context` – JSON-LD context URLs
- Properties – entity-specific attributes

---

## Related Documentation

- **Data Model:** `../docs/DATA_MODEL_AND_ENTITIES.md`
- **Validation:** `../scripts/validate_entities.py`
- **Schemas:** `../schemas/`

