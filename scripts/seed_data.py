"""
Author: Hồ Viết Hiệp
Created at: 2025-11-15
Updated at: 2025-11-22
Description: Seed NGSI-LD entities into Orion-LD using create, update,
             and upsert flows with batching, validation, and error handling.
"""

import json
import sys
import time
import requests
from pathlib import Path
from tqdm import tqdm
from requests.auth import HTTPBasicAuth

sys.path.append(str(Path(__file__).parent.parent))
from config.config import ORION_LD_URL, ORION_LD_USERNAME, ORION_LD_PASSWORD
from config.data_model import get_context

ENTITIES_DIR = Path("ngsi_ld_entities")

ENTITY_FILES = {
    "RoadSegment": ["road_segments_latest.ndjson"],
    "WeatherObserved": ["weather_observed_latest.ndjson"],
    "AirQualityObserved": ["air_quality_observed_latest.ndjson"],
    "Streetlight": ["streetlights_latest.ndjson"],
    "PointOfInterest": ["point_of_interest_latest.ndjson"]
}

MODE_CREATE = "create"
MODE_UPDATE = "update"
MODE_UPSERT = "upsert"
MODE_CHOICES = (MODE_CREATE, MODE_UPDATE, MODE_UPSERT)


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


def check_orion_connection(orion_url, auth=None):
    """
    Check if Orion-LD is accessible
    
    Args:
        orion_url: Orion-LD base URL
        auth: HTTPBasicAuth object (optional)
        
    Returns:
        Tuple of (is_available, version_info)
    """
    try:
        response = requests.get(
            f"{orion_url}/version",
            auth=auth,
            timeout=5
        )
        
        if response.status_code == 200:
            version = response.json()
            return (True, version)
        else:
            return (False, None)
    except Exception as e:
        return (False, str(e))


def remove_attype_recursive(obj):
    """
    Recursively remove @type and @value from nested objects (Orion-LD doesn't accept these in nested properties)
    
    For objects like {"@type": "DateTime", "@value": "2025-11-20T14:09:16Z"},
    this function will return just the value: "2025-11-20T14:09:16Z"
    """
    if isinstance(obj, dict):
        # If object has only @type and/or @value, return the @value (or None)
        if "@value" in obj:
            # Return the value of @value, recursively processed
            return remove_attype_recursive(obj["@value"])
        elif "@type" in obj and len(obj) == 1:
            # Only @type, no @value - skip this object
            return None
        
        # Otherwise, process all keys except @type
        result = {}
        for key, value in obj.items():
            if key == "@type":
                continue  # Skip @type
            processed_value = remove_attype_recursive(value)
            if processed_value is not None:  # Skip None values
                result[key] = processed_value
        return result
    elif isinstance(obj, list):
        processed_list = [remove_attype_recursive(item) for item in obj]
        # Filter out None values
        return [item for item in processed_list if item is not None]
    else:
        return obj


def create_entity(orion_url, entity, auth=None):
    """
    Create a single entity in Orion-LD
    
    Args:
        orion_url: Orion-LD base URL
        entity: Entity dict
        auth: HTTPBasicAuth object (optional)
        
    Returns:
        Tuple of (success, status_code, error_message)
    """
    # IMPORTANT: Orion-LD does NOT accept @type at root level when "type" field exists
    # This is a limitation of Orion-LD - it returns "Duplicated field: type" error
    # SOSA/SSN compliance is achieved through:
    # 1. Context URLs in Link header (includes SOSA context)
    # 2. Documentation explaining SOSA/SSN mapping
    # 3. Conceptual modeling following SOSA/SSN principles
    # 
    # Remove @type and @value from nested properties (Orion-LD doesn't accept these)
    # @context should be in Link header, not in body
    entity_to_send = remove_attype_recursive(entity)
    
    # Remove @type from root level (Orion-LD limitation - cannot have both "type" and "@type")
    if "@type" in entity_to_send:
        entity_to_send.pop("@type")
    
    # Remove @context from body (context will be resolved from Link header)
    if "@context" in entity_to_send:
        entity_to_send.pop("@context")
    headers = {}
    
    # Add Link header for contexts (if Link header is present, don't use Content-Type)
    link_header = build_link_header(entity.get("@context"))
    if link_header:
        headers["Link"] = link_header
    else:
        # Only use Content-Type if no Link header
        headers["Content-Type"] = "application/ld+json"
    
    try:
        response = requests.post(
            f"{orion_url}/ngsi-ld/v1/entities",
            json=entity_to_send,
            headers=headers,
            auth=auth,
            timeout=10
        )
        
        if response.status_code == 201:
            return (True, 201, None)
        elif response.status_code == 409:
            # Entity already exists
            return (False, 409, "Entity already exists")
        else:
            error_msg = response.text[:200]
            return (False, response.status_code, error_msg)
    
    except requests.exceptions.Timeout:
        return (False, 0, "Request timeout")
    except requests.exceptions.ConnectionError:
        return (False, 0, "Connection error")
    except Exception as e:
        return (False, 0, str(e))


def build_link_header(contexts):
    """
    Build Link header for NGSI-LD requests from @context

    Args:
        contexts: str or list of context URLs

    Returns:
        Link header value or None
    """
    # Add Link header for create_entity too
    if not contexts:
        return None

    if isinstance(contexts, str):
        contexts = [contexts]

    parts = [
        f'<{ctx}>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
        for ctx in contexts
    ]
    return ", ".join(parts)


def update_entity(orion_url, entity, auth=None):
    """
    Update an existing entity in Orion-LD
    
    Args:
        orion_url: Orion-LD base URL
        entity: Entity dict
        auth: HTTPBasicAuth object (optional)
        
    Returns:
        Tuple of (success, status_code, error_message)
    """
    entity_id = entity.get('id')
    
    if not entity_id:
        return (False, 400, "Missing entity id")
    
    # IMPORTANT: Orion-LD does NOT accept @type at root level when "type" field exists
    # This is a limitation of Orion-LD - it returns "Duplicated field: type" error
    # SOSA/SSN compliance is achieved through:
    # 1. Context URLs in Link header (includes SOSA context)
    # 2. Documentation explaining SOSA/SSN mapping
    # 3. Conceptual modeling following SOSA/SSN principles
    #
    # Remove @type and @value from nested properties (Orion-LD doesn't accept these)
    entity_clean = remove_attype_recursive(entity)
    
    # Remove @type from root level (Orion-LD limitation - cannot have both "type" and "@type")
    if "@type" in entity_clean:
        entity_clean.pop("@type")
    
    payload = {
        key: value
        for key, value in entity_clean.items()
        if key not in {"id", "type", "@context"}
    }
    
    if not payload:
        return (False, 400, "No attributes to update")
    
    headers = {}

    link_header = build_link_header(entity.get("@context"))
    if link_header:
        headers["Link"] = link_header
    else:
        headers["Content-Type"] = "application/json"

    try:
        response = requests.patch(
            f"{orion_url}/ngsi-ld/v1/entities/{entity_id}/attrs",
            json=payload,
            headers=headers,
            auth=auth,
            timeout=10
        )
        
        if response.status_code in (204, 205, 207):
            return (True, response.status_code, None)
        else:
            error_msg = response.text[:200]
            return (False, response.status_code, error_msg)
    
    except requests.exceptions.Timeout:
        return (False, 0, "Request timeout")
    except requests.exceptions.ConnectionError:
        return (False, 0, "Connection error")
    except Exception as e:
        return (False, 0, str(e))


def process_entities(orion_url, entities, mode=MODE_CREATE, batch_size=100, auth=None):
    """
    Process entities according to mode (create/update/upsert)
    
    Args:
        orion_url: Orion-LD base URL
        entities: List of entity dicts
        mode: Operation mode
        batch_size: Delay interval for throttling
        auth: HTTPBasicAuth object (optional)
        
    Returns:
        Dict with statistics
    """
    stats = {
        'total': len(entities),
        'created': 0,
        'updated': 0,
        'skipped': 0,
        'failed': 0,
        'errors': []
    }
    
    for idx, entity in enumerate(tqdm(entities, desc="Processing", unit="entities"), start=1):
        entity_id = entity.get('id', 'unknown')
        
        if mode == MODE_CREATE:
            success, status_code, error_msg = create_entity(orion_url, entity, auth)
            
            if success:
                stats['created'] += 1
            elif status_code == 409:
                stats['skipped'] += 1
            else:
                stats['failed'] += 1
        elif mode == MODE_UPDATE:
            success, status_code, error_msg = update_entity(orion_url, entity, auth)
            
            if success:
                stats['updated'] += 1
            elif status_code == 404:
                stats['skipped'] += 1
            else:
                stats['failed'] += 1
        elif mode == MODE_UPSERT:
            success, status_code, error_msg = update_entity(orion_url, entity, auth)
            
            if success:
                stats['updated'] += 1
            elif status_code == 404:
                success, status_code, error_msg = create_entity(orion_url, entity, auth)
                
                if success:
                    stats['created'] += 1
                else:
                    stats['failed'] += 1
            else:
                stats['failed'] += 1
        else:
            success = False
            status_code = 400
            error_msg = f"Unsupported mode: {mode}"
            stats['failed'] += 1
        
        if not success and error_msg:
            stats['errors'].append({
                'entity_id': entity_id,
                'status_code': status_code,
                'error': error_msg
            })
        
        if idx % batch_size == 0:
            time.sleep(0.1)
    
    return stats

def delete_all_entities(orion_url, entity_type=None, auth=None):
    """
    Delete all entities of a specific type (or all entities), handling pagination.
    
    Args:
        orion_url: Orion-LD base URL
        entity_type: Entity type to delete (None for all)
        auth: HTTPBasicAuth object (optional)
        
    Returns:
        Total number of entities deleted
    """
    total_deleted = 0
    page_limit = 1000  # Max entities per request

    headers = {}
    if entity_type:
        link_header = build_link_header(get_context(entity_type))
        if link_header:
            headers["Link"] = link_header

    while True:
        try:
            params = {'limit': page_limit}
            if entity_type:
                params['type'] = entity_type
                params['options'] = 'keyValues'

            response = requests.get(
                f"{orion_url}/ngsi-ld/v1/entities",
                params=params,
                headers=headers,
                auth=auth,
                timeout=30
            )

            if response.status_code != 200:
                print(f"[ERROR] Failed to get entities: {response.status_code} - {response.text}")
                break

            entities = response.json()
            if not entities:
                break

            batch_deleted = 0
            for entity in tqdm(entities, desc="Deleting batch", unit="entities"):
                entity_id = entity.get('id')
                if not entity_id:
                    continue

                del_response = requests.delete(
                    f"{orion_url}/ngsi-ld/v1/entities/{entity_id}",
                    auth=auth,
                    timeout=10
                )
                
                if del_response.status_code == 204:
                    batch_deleted += 1
            
            total_deleted += batch_deleted

            # If fewer entities were returned than the limit, it's the last page
            if len(entities) < page_limit:
                break
        
        except Exception as e:
            print(f"[ERROR] An exception occurred during deletion: {e}")
            break
            
    return total_deleted

def print_seed_summary(all_stats):
    """
    Print seeding summary
    
    Args:
        all_stats: Dict of entity_type -> stats
    """
    print("\n" + "=" * 70)
    print("SEEDING SUMMARY")
    print("=" * 70)
    
    total_created = sum(s['created'] for s in all_stats.values())
    total_updated = sum(s['updated'] for s in all_stats.values())
    total_skipped = sum(s['skipped'] for s in all_stats.values())
    total_failed = sum(s['failed'] for s in all_stats.values())
    total_all = sum(s['total'] for s in all_stats.values())
    
    print(f"\nTotal entities: {total_all}")
    print(f"Created: {total_created}")
    print(f"Updated: {total_updated}")
    print(f"Skipped: {total_skipped}")
    print(f"Failed: {total_failed}")
    
    print("\nBy Entity Type:")
    for entity_type, stats in all_stats.items():
        print(f"\n  {entity_type}:")
        print(f"    Total: {stats['total']}")
        print(f"    Created: {stats['created']}")
        print(f"    Updated: {stats['updated']}")
        if stats['skipped'] > 0:
            print(f"    Skipped: {stats['skipped']}")
        if stats['failed'] > 0:
            print(f"    Failed: {stats['failed']}")
    
    print("\n" + "=" * 70)


def print_errors(all_stats, max_errors=5):
    """
    Print detailed error messages
    
    Args:
        all_stats: Dict of entity_type -> stats
        max_errors: Maximum errors to display per type
    """
    has_errors = any(s['failed'] > 0 for s in all_stats.values())
    
    if not has_errors:
        return
    
    print("\n" + "=" * 70)
    print(f"ERRORS (first {max_errors} per type)")
    print("=" * 70)
    
    for entity_type, stats in all_stats.items():
        if stats['failed'] > 0:
            errors = stats['errors'][:max_errors]
            
            print(f"\n{entity_type} ({len(stats['errors'])} errors):")
            
            for i, error in enumerate(errors, 1):
                entity_id = error['entity_id']
                status = error['status_code']
                msg = error['error']
                
                print(f"\n  {i}. {entity_id}")
                print(f"     Status: {status}")
                print(f"     Error: {msg[:100]}")


def main():
    """Main execution"""
    # Parse arguments
    import argparse
    parser = argparse.ArgumentParser(description='Seed NGSI-LD entities to Orion-LD')
    parser.add_argument('--orion-url', default=ORION_LD_URL, help='Orion-LD base URL')
    parser.add_argument('--username', default=ORION_LD_USERNAME, help='Username for authentication')
    parser.add_argument('--password', default=ORION_LD_PASSWORD, help='Password for authentication')
    parser.add_argument('--clear', action='store_true', help='Clear all existing entities before seeding')
    parser.add_argument('--clear-type', help='Clear entities of specific type before seeding')
    parser.add_argument('--delete-only', action='store_true', help='Only perform deletion and exit')
    parser.add_argument('--types', nargs='+', help='Entity types to process (default: all)')
    parser.add_argument('--mode', choices=MODE_CHOICES, default=MODE_CREATE, help='Operation mode: create|update|upsert')
    parser.add_argument('--batch-size', type=int, default=100, help='Throttle delay interval')
    
    args = parser.parse_args()
    
    orion_url = args.orion_url.rstrip('/')
    
    # Setup authentication
    auth = None
    if args.username and args.password:
        auth = HTTPBasicAuth(args.username, args.password)
    
    # Check Orion-LD connection
    is_available, version = check_orion_connection(orion_url, auth)
    
    if not is_available:
        print(f"[ERROR] Cannot connect to Orion-LD: {version}")
        print("\nPlease ensure:")
        print("1. Docker services are running: docker-compose ps")
        print("2. Orion-LD is accessible: curl http://localhost:1026/version")
        print("3. Firewall allows connection to the server")
        return 1
    
    # Clear entities if requested
    if args.clear:
        print("[WARNING] Clearing ALL entities...")
        deleted = delete_all_entities(orion_url, None, auth)
        print(f"[OK] Deleted {deleted} entities")
    elif args.clear_type:
        print(f"[WARNING] Clearing entities of type: {args.clear_type}")
        deleted = delete_all_entities(orion_url, args.clear_type, auth)
        print(f"[OK] Deleted {deleted} entities")

    if args.delete_only:
        return 0
    
    # Determine which types to seed
    types_to_seed = args.types if args.types else list(ENTITY_FILES.keys())
    
    # Seed entities
    all_stats = {}
    
    for entity_type in types_to_seed:
        if entity_type not in ENTITY_FILES:
            print(f"[WARNING] Unknown entity type: {entity_type}")
            continue
        
        all_entities = []
        for file in ENTITY_FILES[entity_type]:
            entities = load_entities_ndjson(file)
            all_entities.extend(entities)
        
        if not all_entities:
            print(f"[WARNING] No entities found for {entity_type}")
            continue
        
        stats = process_entities(
            orion_url,
            all_entities,
            mode=args.mode,
            batch_size=args.batch_size,
            auth=auth
        )
        all_stats[entity_type] = stats
    
    # Print summary
    print_seed_summary(all_stats)
    
    # Print errors
    print_errors(all_stats)
    
    # Final status
    total_failed = sum(s['failed'] for s in all_stats.values())
    
    if total_failed == 0:
        print("\n[SUCCESS] All entities seeded successfully!")
        return 0
    else:
        print(f"\n[WARNING] {total_failed} entities failed to seed")
        print("Check errors above for details.")
        return 0


if __name__ == "__main__":
    exit(main())

