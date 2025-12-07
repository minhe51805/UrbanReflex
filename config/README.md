# config/ – Configuration and data model constants

This directory contains Python configuration files that manage API credentials, data model constants, and helper functions for UrbanReflex.

---

## Purpose

Centralized configuration for:
- API keys and service URLs (OpenWeatherMap, OpenAQ, Orion-LD, etc.)
- NGSI-LD entity types, ID prefixes, and relationship types
- Data model constants and validation helpers
- Geographic boundaries and spatial thresholds

---

## Files

### `config.py`
Manages API credentials and service configuration:
- Environment variable loading (`.env` file)
- API keys: `OWM_API_KEY`, `OPENAQ_API_KEY`, `ORION_LD_URL`
- Geographic settings: `HCMC_CENTER`, `HCMC_BBOX_FULL`, `HCMC_BBOX_CENTER`
- Data directories: `RAW_DATA_DIR`, `ENTITIES_DIR`

### `data_model.py`
Defines NGSI-LD data model constants:
- Entity types: `EntityType.ROAD_SEGMENT`, `EntityType.STREETLIGHT`, etc.
- ID prefixes: `IDPrefix.ROAD_SEGMENT`, `IDPrefix.STREETLIGHT`, etc.
- Relationship types: `RelationshipType.LOCATED_AT`, `RelationshipType.CONTROLLED_BY`, etc.
- Helper functions: `create_entity_id()`, `get_context()`, `validate_entity_id()`

### `__init__.py`
Package initialization that exports all constants and helpers for easy import:

```python
from config import EntityType, IDPrefix, ORION_LD_URL
```

---

## Setup

1. Copy `.env.example` to `.env` in the project root
2. Fill in your API keys and service URLs
3. Import config in your scripts:

```python
from config.config import ORION_LD_URL, OWM_API_KEY
from config.data_model import EntityType, create_entity_id
```

---

## Related Documentation

- **Environment Setup:** `../docs/ENV_SETUP.md`
- **Data Model:** `../docs/DATA_MODEL_AND_ENTITIES.md`
- **Scripts:** `../scripts/README.md`

