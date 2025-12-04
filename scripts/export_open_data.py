"""
Author: Hồ Viết Hiệp
Created at: 2025-11-27
Updated at: 2025-11-30
Description: A utility to export NGSI-LD entities to various open data formats.
"""

import argparse
import sys
import json
import csv
from pathlib import Path

import requests
from tqdm import tqdm

# Add project root to path to import config
sys.path.append(str(Path(__file__).parent.parent))

from config.data_model import EntityType, get_context
from config.config import ORION_LD_URL

# Define CONTEXTS for Link headers
CORE = '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
SOSA = '<https://www.w3.org/ns/sosa/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
TRANSPORT = '<https://smart-data-models.github.io/dataModel.Transportation/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
STREETLIGHT_CTX = '<https://smart-data-models.github.io/dataModel.Streetlighting/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
WEATHER_CTX = '<https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
AQI_CTX = '<https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
POI_CTX = '<https://raw.githubusercontent.com/smart-data-models/dataModel.PointOfInterest/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'

CONTEXTS = {
    EntityType.ROAD_SEGMENT: ", ".join([CORE, SOSA, TRANSPORT]),
    EntityType.STREETLIGHT: STREETLIGHT_CTX,
    EntityType.WEATHER_OBSERVED: ", ".join([CORE, SOSA, WEATHER_CTX]),
    EntityType.AIR_QUALITY_OBSERVED: ", ".join([CORE, SOSA, AQI_CTX]),
    EntityType.POINT_OF_INTEREST: POI_CTX,
    EntityType.CITIZEN_REPORT: CORE,
}

ENTITY_TYPES = list(CONTEXTS.keys())


def fetch_all_entities(entity_type: str, limit: int = None, chunk_size: int = 1000):
    """Fetches all entities of a given type, handling pagination."""
    results = []
    offset = 0
    headers = {"Link": CONTEXTS[entity_type]}

    with tqdm(desc=f"Fetching {entity_type}", unit=" entities") as pbar:
        while True:
            params = {
                "type": entity_type,
                "options": "keyValues",
                "limit": chunk_size,
                "offset": offset,
            }
            try:
                resp = requests.get(f"{ORION_LD_URL}/ngsi-ld/v1/entities", params=params, headers=headers, timeout=30)
                resp.raise_for_status()
                batch = resp.json()
            except requests.RequestException as e:
                print(f"\n[ERROR] Could not fetch {entity_type}: {e}")
                break

            if not isinstance(batch, list):
                print(f"\n[ERROR] Unexpected response for {entity_type}: {batch}")
                break

            results.extend(batch)
            pbar.update(len(batch))

            if len(batch) < chunk_size or (limit and len(results) >= limit):
                break

            offset += chunk_size
    
    return results[:limit] if limit else results

def anonymize_reports(reports: list) -> list:
    """Removes personally identifiable information from CitizenReport entities."""
    anonymized_reports = []
    pii_fields = ["reporterName", "reporterContact"]
    for report in reports:
        clean_report = report.copy()
        for field in pii_fields:
            if field in clean_report:
                del clean_report[field]
        anonymized_reports.append(clean_report)
    return anonymized_reports

def save_to_ndjson(entities: list, filepath: Path):
    """Saves a list of entities to an NDJSON file."""
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            for entity in entities:
                f.write(json.dumps(entity, ensure_ascii=False) + "\n")
        print(f"   -> Saved {len(entities)} entities to {filepath}")
    except Exception as e:
        print(f"   -> [ERROR] Failed to save NDJSON: {e}")

def flatten_entity(entity):
    """Flattens a nested NGSI-LD entity for CSV export."""
    flat = {}
    for key, value in entity.items():
        if isinstance(value, dict):
            if "type" in value and value["type"] == "Point":
                flat[f"{key}_lon"] = value.get("coordinates", [None, None])[0]
                flat[f"{key}_lat"] = value.get("coordinates", [None, None])[1]
            elif "@type" in value and value["@type"] == "DateTime":
                flat[key] = value.get("@value")
            else:
                # Generic nested object flattening
                for sub_key, sub_value in value.items():
                    flat[f"{key}_{sub_key}"] = sub_value
        elif isinstance(value, list):
            flat[key] = ",".join(map(str, value))
        else:
            flat[key] = value
    return flat

def save_to_csv(entities: list, filepath: Path):
    """Saves a list of entities to a CSV file."""
    if not entities:
        return

    try:
        # Flatten all entities and collect all possible headers
        flattened_entities = [flatten_entity(e) for e in entities]
        all_headers = sorted(list(set(k for d in flattened_entities for k in d.keys())))

        with open(filepath, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=all_headers)
            writer.writeheader()
            writer.writerows(flattened_entities)
        print(f"   -> Saved {len(entities)} entities to {filepath}")
    except Exception as e:
        print(f"   -> [ERROR] Failed to save CSV: {e}")

def save_to_geojson(entities: list, filepath: Path):
    """Saves geolocated entities to a GeoJSON file."""
    features = []
    for entity in entities:
        if "location" in entity and isinstance(entity["location"], dict):
            geom = entity["location"]
            props = {k: v for k, v in entity.items() if k != "location"}
            features.append({"type": "Feature", "geometry": geom, "properties": props})

    if not features:
        print(f"   -> No geolocated entities found for {filepath.stem}, skipping GeoJSON.")
        return

    feature_collection = {"type": "FeatureCollection", "features": features}
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(feature_collection, f, ensure_ascii=False)
        print(f"   -> Saved {len(features)} features to {filepath}")
    except Exception as e:
        print(f"   -> [ERROR] Failed to save GeoJSON: {e}")

def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(
        description="Export NGSI-LD entities to open data formats (CSV, GeoJSON, NDJSON)."
    )

    parser.add_argument(
        "--types",
        nargs="+",
        default=ENTITY_TYPES,
        help=f"Entity types to export. Default: all. Choices: {', '.join(ENTITY_TYPES)}"
    )

    parser.add_argument(
        "--formats",
        nargs="+",
        default=["ndjson", "csv", "geojson"],
        choices=["ndjson", "csv", "geojson"],
        help="Output formats. Default: ndjson, csv, geojson."
    )

    parser.add_argument(
        "--output-dir",
        default="open_data",
        help="Directory to save exported files. Default: open_data/"
    )
    
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Limit the number of entities per type for quick testing."
    )

    args = parser.parse_args()

    print("===== Open Data Export Configuration =====")
    print(f"Entity Types: {', '.join(args.types)}")
    print(f"Formats: {', '.join(args.formats)}")
    print(f"Output Directory: {args.output_dir}")
    if args.limit:
        print(f"Limit per type: {args.limit}")
    print("========================================\n")

    # Create output directory
    output_path = Path(args.output_dir)
    output_path.mkdir(exist_ok=True)

    for entity_type in args.types:
        if entity_type not in CONTEXTS:
            print(f"[WARNING] Unknown entity type '{entity_type}', skipping.")
            continue

        entities = fetch_all_entities(entity_type, limit=args.limit)
        print(f"Fetched {len(entities)} {entity_type} entities.")

        # Anonymize CitizenReport data
        if entity_type == EntityType.CITIZEN_REPORT:
            entities = anonymize_reports(entities)
            print(f"-> Anonymized {len(entities)} CitizenReport entities.")

        # Save to requested formats
        if "ndjson" in args.formats:
            save_to_ndjson(entities, output_path / f"{entity_type}.ndjson")
        if "csv" in args.formats:
            save_to_csv(entities, output_path / f"{entity_type}.csv")
        if "geojson" in args.formats:
            save_to_geojson(entities, output_path / f"{entity_type}.geojson")

        print(f"-> Finished processing {entity_type}\n")

    print("Script finished.")


if __name__ == "__main__":
    main()
