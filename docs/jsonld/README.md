# jsonld/ – JSON-LD context files

This directory contains JSON-LD context files that define the vocabulary and property mappings for NGSI-LD entities in UrbanReflex.

---

## Purpose

JSON-LD contexts provide semantic meaning to entity properties, enabling:
- Property name resolution (short names → full URIs)
- Interoperability with other NGSI-LD systems
- Compliance with ETSI NGSI-LD and FiWARE standards

---

## Available Contexts

- `roadsegment.context.jsonld` – context for RoadSegment entities
- `streetlight.context.jsonld` – context for Streetlight entities

Other entity types use standard contexts from:
- ETSI NGSI-LD Core Context
- FiWARE Smart Data Models contexts
- SOSA/SSN ontology contexts

---

## Usage

Contexts are typically referenced in the `Link` header when making NGSI-LD API requests:

```python
headers = {
    "Link": '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
}
```

For local contexts, you can also include them in the `@context` property of entities.

---

## Related Documentation

- **Data Model:** `../DATA_MODEL_AND_ENTITIES.md`
- **NGSI-LD Guide:** `../NGSI_LD_GUIDE.md`
- **ETSI NGSI-LD:** https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/

