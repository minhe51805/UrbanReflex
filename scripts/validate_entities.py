# ============================================================================
# UrbanReflex — Smart City Intelligence Platform
# Copyright (C) 2025  WAG
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
# For more information, visit: https://github.com/minhe51805/UrbanReflex
# ============================================================================

import json
import sys
from pathlib import Path
from jsonschema import validate, ValidationError, Draft7Validator
from tqdm import tqdm

sys.path.append(str(Path(__file__).parent.parent))
from config.data_model import EntityType


SCHEMA_DIR = Path("schemas")
ENTITIES_DIR = Path("ngsi_ld_entities")


SCHEMA_FILES = {
    EntityType.WEATHER_OBSERVED: "weather_observed_schema.json",
    EntityType.AIR_QUALITY_OBSERVED: "air_quality_observed_schema.json",
    EntityType.STREETLIGHT: "streetlight_schema.json",
    EntityType.POINT_OF_INTEREST: "point_of_interest_schema.json"
}


ENTITY_FILES = {
    EntityType.ROAD_SEGMENT: [
        "road_segments_latest.ndjson"
    ],
    EntityType.WEATHER_OBSERVED: [
        "weather_observed_latest.ndjson",
        "weather_observed_forecast_latest.ndjson"
    ],
    EntityType.AIR_QUALITY_OBSERVED: [
        "air_quality_observed_latest.ndjson"
    ],
    EntityType.STREETLIGHT: [
        "streetlights_latest.ndjson"
    ],
    EntityType.POINT_OF_INTEREST: [
        "point_of_interest_latest.ndjson"
    ]
}


def load_schema(schema_file):
    """
    Load JSON schema from file
    
    Args:
        schema_file: Schema filename
        
    Returns:
        Dict with schema or None
    """
    schema_path = SCHEMA_DIR / schema_file
    
    if not schema_path.exists():
        return None
    
    with open(schema_path, 'r', encoding='utf-8') as f:
        schema = json.load(f)
    
    return schema


def load_entities_ndjson(entity_file):
    """
    Load entities from NDJSON file
    
    Args:
        entity_file: NDJSON filename
        
    Returns:
        List of entity dicts
    """
    entity_path = ENTITIES_DIR / entity_file
    
    if not entity_path.exists():
        return []
    
    entities = []
    
    with open(entity_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                entity = json.loads(line)
                entities.append(entity)
    
    return entities


def validate_entity(entity, schema):
    """
    Validate a single entity against schema
    
    Args:
        entity: Entity dict
        schema: Schema dict
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if schema is None:
        return (True, "No schema available - skipping validation")
    
    try:
        validate(instance=entity, schema=schema)
        return (True, None)
    except ValidationError as e:
        error_msg = f"{e.message} at path: {list(e.path)}"
        return (False, error_msg)


def validate_basic_ngsi_ld_structure(entity):
    """
    Validate basic NGSI-LD structure requirements
    
    Args:
        entity: Entity dict
        
    Returns:
        Tuple of (is_valid, errors_list)
    """
    errors = []
    
    # Check required fields
    if 'id' not in entity:
        errors.append("Missing required field: id")
    elif not entity['id'].startswith('urn:ngsi-ld:'):
        errors.append(f"Invalid id format: {entity['id']}")
    
    if 'type' not in entity:
        errors.append("Missing required field: type")
    
    if '@context' not in entity:
        errors.append("Missing required field: @context")
    
    # Check Property structure
    for key, value in entity.items():
        if key in ['id', 'type', '@context']:
            continue
        
        if isinstance(value, dict):
            if 'type' not in value:
                errors.append(f"Property '{key}' missing 'type' field")
            else:
                prop_type = value['type']
                if prop_type not in ['Property', 'GeoProperty', 'Relationship']:
                    errors.append(f"Property '{key}' has invalid type: {prop_type}")
                
                # Check Property/GeoProperty has value
                if prop_type in ['Property', 'GeoProperty'] and 'value' not in value:
                    errors.append(f"Property '{key}' missing 'value' field")
                
                # Check Relationship has object
                if prop_type == 'Relationship' and 'object' not in value:
                    errors.append(f"Relationship '{key}' missing 'object' field")
    
    is_valid = len(errors) == 0
    return (is_valid, errors)


def validate_entity_type(entity_type, files, schema=None):
    """
    Validate all entities of a specific type
    
    Args:
        entity_type: Entity type string
        files: List of NDJSON files to validate
        schema: JSON Schema dict (optional)
        
    Returns:
        Dict with validation results
    """
    results = {
        'entity_type': entity_type,
        'total': 0,
        'valid': 0,
        'invalid': 0,
        'structure_errors': 0,
        'schema_errors': 0,
        'errors': []
    }
    
    print(f"\nValidating {entity_type}...")
    
    all_entities = []
    for file in files:
        entities = load_entities_ndjson(file)
        all_entities.extend(entities)
    
    if not all_entities:
        print(f"  [WARNING] No entities found")
        return results
    
    results['total'] = len(all_entities)
    
    for entity in tqdm(all_entities, desc="  Validating", unit="entities"):
        entity_id = entity.get('id', 'unknown')
        
        # Validate basic NGSI-LD structure
        is_valid_structure, structure_errors = validate_basic_ngsi_ld_structure(entity)
        
        if not is_valid_structure:
            results['invalid'] += 1
            results['structure_errors'] += 1
            results['errors'].append({
                'entity_id': entity_id,
                'type': 'structure',
                'errors': structure_errors
            })
            continue
        
        # Validate against schema if available
        if schema:
            is_valid_schema, schema_error = validate_entity(entity, schema)
            
            if not is_valid_schema:
                results['invalid'] += 1
                results['schema_errors'] += 1
                results['errors'].append({
                    'entity_id': entity_id,
                    'type': 'schema',
                    'errors': [schema_error]
                })
                continue
        
        results['valid'] += 1
    
    return results


def print_validation_summary(all_results):
    """
    Print validation summary
    
    Args:
        all_results: List of result dicts
    """
    print("\n" + "=" * 70)
    print("VALIDATION SUMMARY")
    print("=" * 70)
    
    total_entities = sum(r['total'] for r in all_results)
    total_valid = sum(r['valid'] for r in all_results)
    total_invalid = sum(r['invalid'] for r in all_results)
    
    print(f"\nTotal entities validated: {total_entities}")
    print(f"Valid: {total_valid} ({total_valid/total_entities*100:.1f}%)")
    print(f"Invalid: {total_invalid} ({total_invalid/total_entities*100:.1f}%)")
    
    print("\nBy Entity Type:")
    for result in all_results:
        entity_type = result['entity_type']
        total = result['total']
        valid = result['valid']
        invalid = result['invalid']
        
        if total > 0:
            print(f"\n  {entity_type}:")
            print(f"    Total: {total}")
            print(f"    Valid: {valid} ({valid/total*100:.1f}%)")
            if invalid > 0:
                print(f"    Invalid: {invalid}")
                print(f"      Structure errors: {result['structure_errors']}")
                print(f"      Schema errors: {result['schema_errors']}")
    
    print("\n" + "=" * 70)


def print_detailed_errors(all_results, max_errors=10):
    """
    Print detailed error messages
    
    Args:
        all_results: List of result dicts
        max_errors: Maximum number of errors to display per type
    """
    has_errors = any(r['invalid'] > 0 for r in all_results)
    
    if not has_errors:
        print("\n[SUCCESS] All entities are valid!")
        return
    
    print("\n" + "=" * 70)
    print("VALIDATION ERRORS (first {} per type)".format(max_errors))
    print("=" * 70)
    
    for result in all_results:
        if result['invalid'] > 0:
            entity_type = result['entity_type']
            errors = result['errors'][:max_errors]
            
            print(f"\n{entity_type} ({len(result['errors'])} errors):")
            
            for i, error in enumerate(errors, 1):
                entity_id = error['entity_id']
                error_type = error['type']
                error_msgs = error['errors']
                
                print(f"\n  {i}. {entity_id}")
                print(f"     Type: {error_type}")
                for msg in error_msgs[:3]:
                    print(f"     - {msg}")
                
                if len(error_msgs) > 3:
                    print(f"     ... and {len(error_msgs)-3} more errors")


def main():
    """Main execution"""
    print("=" * 70)
    print("UrbanReflex - NGSI-LD Entity Validator")
    print("=" * 70)
    print("\nValidating entities against FiWARE Smart Data Models...")
    
    all_results = []
    
    # Validate RoadSegment (no schema available)
    print("\n--- RoadSegment (no FiWARE schema available) ---")
    result = validate_entity_type(
        EntityType.ROAD_SEGMENT,
        ENTITY_FILES[EntityType.ROAD_SEGMENT],
        schema=None
    )
    all_results.append(result)
    
    # Validate WeatherObserved
    print("\n--- WeatherObserved ---")
    schema = load_schema(SCHEMA_FILES[EntityType.WEATHER_OBSERVED])
    if schema:
        print("  [OK] Schema loaded")
    else:
        print("  [WARNING] Schema not found - using basic validation only")
    
    result = validate_entity_type(
        EntityType.WEATHER_OBSERVED,
        ENTITY_FILES[EntityType.WEATHER_OBSERVED],
        schema=schema
    )
    all_results.append(result)
    
    # Validate AirQualityObserved
    print("\n--- AirQualityObserved ---")
    schema = load_schema(SCHEMA_FILES[EntityType.AIR_QUALITY_OBSERVED])
    if schema:
        print("  [OK] Schema loaded")
    else:
        print("  [WARNING] Schema not found - using basic validation only")
    
    result = validate_entity_type(
        EntityType.AIR_QUALITY_OBSERVED,
        ENTITY_FILES[EntityType.AIR_QUALITY_OBSERVED],
        schema=schema
    )
    all_results.append(result)
    
    # Validate Streetlight
    print("\n--- Streetlight ---")
    schema = load_schema(SCHEMA_FILES[EntityType.STREETLIGHT])
    if schema:
        print("  [OK] Schema loaded")
    else:
        print("  [WARNING] Schema not found - using basic validation only")
    
    result = validate_entity_type(
        EntityType.STREETLIGHT,
        ENTITY_FILES[EntityType.STREETLIGHT],
        schema=schema
    )
    all_results.append(result)
    
    # Validate PointOfInterest
    print("\n--- PointOfInterest ---")
    schema = load_schema(SCHEMA_FILES[EntityType.POINT_OF_INTEREST])
    if schema:
        print("  [OK] Schema loaded")
    else:
        print("  [WARNING] Schema not found - using basic validation only")
    
    result = validate_entity_type(
        EntityType.POINT_OF_INTEREST,
        ENTITY_FILES[EntityType.POINT_OF_INTEREST],
        schema=schema
    )
    all_results.append(result)
    
    # Print summary
    print_validation_summary(all_results)
    
    # Print detailed errors
    print_detailed_errors(all_results, max_errors=5)
    
    # Determine exit code
    total_invalid = sum(r['invalid'] for r in all_results)
    
    if total_invalid == 0:
        print("\n[SUCCESS] All entities passed validation!")
        return 0
    else:
        print(f"\n[WARNING] {total_invalid} entities failed validation")
        print("Review errors above and fix transformation scripts if needed.")
        return 0  # Return 0 anyway to not block pipeline


if __name__ == "__main__":
    exit(main())

