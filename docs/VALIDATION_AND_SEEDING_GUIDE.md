# Validation and Seeding Guide

Guide for validating NGSI-LD entities and seeding data into Orion-LD Context Broker.

---

## Overview

This guide covers the final steps of the UrbanReflex data pipeline:
1. **Validation** - Verify entities conform to NGSI-LD and FiWARE standards
2. **Seeding** - Load validated entities into Orion-LD Context Broker

---

## Prerequisites

- Transformed NGSI-LD entities in `ngsi_ld_entities/` directory
- FiWARE JSON schemas in `schemas/` directory
- Running Orion-LD Context Broker (see `INFRASTRUCTURE_SETUP.md`)

---

## Validation

### Purpose

Validates that transformed entities:
- Follow basic NGSI-LD structure (id, type, @context)
- Conform to FiWARE Smart Data Models schemas
- Have correct property types (Property, GeoProperty, Relationship)

### Usage

```bash
# Validate all entity types
python scripts/validate_entities.py

# Validate specific entity type
python scripts/validate_entities.py --type WeatherObserved
```

### Output

```
Validation Results:
==================
✓ RoadSegment: 4,956 valid entities
✓ WeatherObserved: 121 valid entities
✓ AirQualityObserved: 10 valid entities
✗ Streetlight: 17,205 valid, 0 invalid
✓ PointOfInterest: 89 valid entities

Total: 22,381 entities validated
```

### Validation Checks

1. **Basic NGSI-LD Structure:**
   - Has `id`, `type`, `@context`
   - ID follows `urn:ngsi-ld:EntityType:UniqueID` format
   - All attributes have proper `type` field

2. **FiWARE Schema Compliance:**
   - Required properties present
   - Property types match schema
   - Unit codes valid (when specified)

### Common Validation Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Missing `@context` | Entity lacks JSON-LD context | Add NGSI-LD context URL |
| Invalid ID format | ID doesn't follow URN format | Use `urn:ngsi-ld:Type:ID` |
| Missing `type` in property | Property lacks type field | Add `"type": "Property"` |
| Invalid coordinates | GeoProperty coordinates format wrong | Use `[lon, lat]` array |

### Performance Notes

- Validation can be slow for large datasets (17k+ entities)
- Schema validation is optional for basic checks
- Consider validating samples during development

---

## Seeding

### Purpose

Loads validated NGSI-LD entities into Orion-LD Context Broker via REST API.

### Usage

```bash
# Seed all entities (localhost)
python scripts/seed_data.py

# Seed to remote Orion-LD
python scripts/seed_data.py --orion-url http://your-server:1026

# Seed specific entity types only
python scripts/seed_data.py --types WeatherObserved AirQualityObserved

# Clear existing data before seeding
python scripts/seed_data.py --clear
```

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--orion-url` | Orion-LD endpoint | `http://103.178.233.233:1026` |
| `--types` | Entity types to seed | `RoadSegment Streetlight` |
| `--clear` | Clear existing entities first | N/A (flag) |
| `--batch-size` | Entities per batch | `--batch-size 100` |

### Seeding Process

1. **Load Entities** - Read all `.ndjson` files from `ngsi_ld_entities/`
2. **Filter** - Select specified entity types (if `--types` provided)
3. **Clear** - Delete existing entities (if `--clear` flag set)
4. **Batch POST** - Send entities to Orion-LD in batches
5. **Report** - Display success/failure statistics

### Output

```
Seeding Data to Orion-LD...
============================

Processing RoadSegment: 100%|████████| 4,956/4,956
Processing WeatherObserved: 100%|████| 121/121
Processing AirQualityObserved: 100%|█| 10/10
Processing Streetlight: 100%|████████| 17,205/17,205
Processing PointOfInterest: 100%|████| 89/89

Summary:
--------
Total entities: 22,381
✓ Created: 22,379
⚠ Already exists: 2
✗ Failed: 0

Seeding completed successfully!
```

### Error Handling

| Status Code | Meaning | Action |
|-------------|---------|--------|
| 201 Created | Entity successfully created | Continue |
| 409 Conflict | Entity already exists | Skip (counted as "already exists") |
| 400 Bad Request | Invalid entity format | Log error, investigate entity |
| 422 Unprocessable | Schema validation failed | Check entity structure |
| 500 Server Error | Orion-LD internal error | Check Orion-LD logs |

### Common Seeding Issues

**Issue 1: Connection Refused**
```
Error: Connection refused to localhost:1026
```
**Solution:** Ensure Orion-LD is running (`docker ps`)

**Issue 2: 409 Conflicts**
```
Entity already exists: urn:ngsi-ld:RoadSegment:HCMC-123
```
**Solution:** Use `--clear` flag or delete entities manually

**Issue 3: 400 Bad Request**
```
Invalid entity: coordinates must be array, got string
```
**Solution:** Check GeoProperty format in transformation scripts

---

## Verification

### Check Entities in Orion-LD

```bash
# Get all entity types
curl http://localhost:1026/ngsi-ld/v1/types

# Count entities by type
curl http://localhost:1026/ngsi-ld/v1/entities?type=RoadSegment&count=true&limit=1

# Get sample entity
curl http://localhost:1026/ngsi-ld/v1/entities/urn:ngsi-ld:RoadSegment:HCMC-32575823
```

### Query Examples

**Get all weather observations:**
```bash
curl 'http://localhost:1026/ngsi-ld/v1/entities?type=WeatherObserved&limit=10'
```

**Get entities near a location (geo-query):**
```bash
curl 'http://localhost:1026/ngsi-ld/v1/entities?type=Streetlight&georel=near;maxDistance==1000&coordinates=[106.7,10.77]&geometry=Point'
```

**Get entities with specific property:**
```bash
curl 'http://localhost:1026/ngsi-ld/v1/entities?type=AirQualityObserved&q=pm25>50'
```

---

## Data Statistics (Ho Chi Minh City)

| Entity Type | Count | Source |
|-------------|-------|--------|
| RoadSegment | 4,956 | OpenStreetMap |
| Streetlight | 17,205 | Synthetic (generated) |
| PointOfInterest | 89 | OpenStreetMap |
| WeatherObserved | 121 | OpenWeatherMap (current + 5-day forecast) |
| AirQualityObserved | 10 | OpenAQ stations + synthetic measurements |
| **Total** | **22,381** | |

---

## Best Practices

### For Development

1. **Validate samples first** - Test with small datasets before full validation
2. **Seed incrementally** - Seed one entity type at a time to isolate issues
3. **Check logs** - Monitor Orion-LD logs for detailed error messages
4. **Use local Orion-LD** - Test on localhost before seeding to production

### For Production

1. **Backup first** - Backup MongoDB before major seeding operations
2. **Use `--clear` carefully** - Only clear when you want to reset all data
3. **Monitor performance** - Large datasets may take time to seed
4. **Set up monitoring** - Use Orion-LD metrics to track entity counts

### Data Refresh Strategy

```bash
# Daily weather update (incremental)
python scripts/fetch_weather_owm.py
python scripts/transform_weather.py
python scripts/seed_data.py --types WeatherObserved --orion-url http://your-server:1026

# Weekly AQI update (incremental)
python scripts/fetch_aqi_openaq.py
python scripts/transform_aqi.py
python scripts/seed_data.py --types AirQualityObserved --orion-url http://your-server:1026

# One-time road network update (clear first)
python scripts/fetch_osm_roads.py
python scripts/transform_roads.py
python scripts/seed_data.py --types RoadSegment --clear --orion-url http://your-server:1026
```

---

## Troubleshooting

### Validation is Slow

**Problem:** Validating 22k entities takes several minutes

**Solutions:**
- Skip schema validation for basic checks (modify `validate_entities.py`)
- Validate only changed entity types
- Use multiprocessing for parallel validation

### Seeding Fails Partway Through

**Problem:** Some entities seed successfully, then fails

**Solutions:**
1. Check error logs in script output
2. Verify Orion-LD is still running (`docker ps`)
3. Check MongoDB disk space
4. Reduce batch size (`--batch-size 50`)

### Entities Don't Appear in Orion-LD

**Problem:** Seeding succeeds but queries return empty

**Solutions:**
1. Check entity type name matches query
2. Verify @context is correct
3. Check Orion-LD logs: `docker logs urbanreflex-orion-ld`
4. Query MongoDB directly to verify storage

---

## Next Steps

After successful seeding:

1. **Query Data** - Test various Orion-LD queries
2. **Build Frontend** - Create visualization dashboard
3. **Set Up Subscriptions** - Configure Orion-LD subscriptions for real-time updates
4. **Add Citizen Reports** - Implement user-generated content ingestion

---

## Reference

- Orion-LD API: https://github.com/FIWARE/context.Orion-LD
- NGSI-LD Spec: https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.08.01_60/gs_CIM009v010801p.pdf
- FiWARE Data Models: https://github.com/smart-data-models/data-models

