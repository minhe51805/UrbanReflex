"""
Author: Hồ Viết Hiệp
Created at: 2025-11-15
Updated at: 2025-11-16
Describe: Seed NGSI-LD entities to Orion-LD Context Broker via API.
         Supports batch processing and error handling.
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


ENTITIES_DIR = Path("ngsi_ld_entities")

ENTITY_FILES = {
    "RoadSegment": ["road_segments_latest.ndjson"],
    "WeatherObserved": ["weather_observed_latest.ndjson"],
    "AirQualityObserved": ["air_quality_observed_latest.ndjson"],
    "Streetlight": ["streetlights_latest.ndjson"],
    "PointOfInterest": ["point_of_interest_latest.ndjson"]
}


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
    try:
        response = requests.post(
            f"{orion_url}/ngsi-ld/v1/entities",
            json=entity,
            headers={
                "Content-Type": "application/ld+json"
            },
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


def batch_create_entities(orion_url, entities, batch_size=100, auth=None):
    """
    Create multiple entities with batch processing
    
    Args:
        orion_url: Orion-LD base URL
        entities: List of entity dicts
        batch_size: Number of entities per batch
        auth: HTTPBasicAuth object (optional)
        
    Returns:
        Dict with statistics
    """
    stats = {
        'total': len(entities),
        'created': 0,
        'already_exists': 0,
        'failed': 0,
        'errors': []
    }
    
    print(f"\nSeeding {len(entities)} entities...")
    
    for entity in tqdm(entities, desc="Seeding", unit="entities"):
        entity_id = entity.get('id', 'unknown')
        
        success, status_code, error_msg = create_entity(orion_url, entity, auth)
        
        if success:
            stats['created'] += 1
        elif status_code == 409:
            stats['already_exists'] += 1
        else:
            stats['failed'] += 1
            stats['errors'].append({
                'entity_id': entity_id,
                'status_code': status_code,
                'error': error_msg
            })
        
        # Small delay to avoid overwhelming the server
        if stats['created'] % batch_size == 0:
            time.sleep(0.1)
    
    return stats


def delete_all_entities(orion_url, entity_type=None, auth=None):
    """
    Delete all entities of a specific type (or all entities)
    
    Args:
        orion_url: Orion-LD base URL
        entity_type: Entity type to delete (None for all)
        auth: HTTPBasicAuth object (optional)
        
    Returns:
        Number of entities deleted
    """
    try:
        # Get all entities
        params = {}
        if entity_type:
            params['type'] = entity_type
        
        response = requests.get(
            f"{orion_url}/ngsi-ld/v1/entities",
            params=params,
            auth=auth,
            timeout=10
        )
        
        if response.status_code != 200:
            print(f"[ERROR] Failed to get entities: {response.status_code}")
            return 0
        
        entities = response.json()
        
        if not entities:
            print(f"[INFO] No entities found for type: {entity_type or 'all'}")
            return 0
        
        print(f"\nDeleting {len(entities)} entities...")
        deleted = 0
        
        for entity in tqdm(entities, desc="Deleting", unit="entities"):
            entity_id = entity.get('id')
            
            del_response = requests.delete(
                f"{orion_url}/ngsi-ld/v1/entities/{entity_id}",
                auth=auth,
                timeout=10
            )
            
            if del_response.status_code == 204:
                deleted += 1
        
        return deleted
    
    except Exception as e:
        print(f"[ERROR] Failed to delete entities: {e}")
        return 0


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
    total_exists = sum(s['already_exists'] for s in all_stats.values())
    total_failed = sum(s['failed'] for s in all_stats.values())
    total_all = sum(s['total'] for s in all_stats.values())
    
    print(f"\nTotal entities: {total_all}")
    print(f"Created: {total_created}")
    print(f"Already exists: {total_exists}")
    print(f"Failed: {total_failed}")
    
    print("\nBy Entity Type:")
    for entity_type, stats in all_stats.items():
        print(f"\n  {entity_type}:")
        print(f"    Total: {stats['total']}")
        print(f"    Created: {stats['created']}")
        if stats['already_exists'] > 0:
            print(f"    Already exists: {stats['already_exists']}")
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
    print("=" * 70)
    print("UrbanReflex - NGSI-LD Entity Seeder")
    print("=" * 70)
    
    # Parse arguments
    import argparse
    parser = argparse.ArgumentParser(description='Seed NGSI-LD entities to Orion-LD')
    parser.add_argument('--orion-url', default=ORION_LD_URL, help='Orion-LD base URL')
    parser.add_argument('--username', default=ORION_LD_USERNAME, help='Username for authentication')
    parser.add_argument('--password', default=ORION_LD_PASSWORD, help='Password for authentication')
    parser.add_argument('--clear', action='store_true', help='Clear all existing entities before seeding')
    parser.add_argument('--clear-type', help='Clear entities of specific type before seeding')
    parser.add_argument('--types', nargs='+', help='Entity types to seed (default: all)')
    
    args = parser.parse_args()
    
    orion_url = args.orion_url.rstrip('/')
    
    # Setup authentication
    auth = None
    if args.username and args.password:
        auth = HTTPBasicAuth(args.username, args.password)
        print(f"\n[INFO] Using authentication: {args.username}")
    
    # Check Orion-LD connection
    print(f"\n[INFO] Connecting to Orion-LD: {orion_url}")
    is_available, version = check_orion_connection(orion_url, auth)
    
    if not is_available:
        print(f"[ERROR] Cannot connect to Orion-LD: {version}")
        print("\nPlease ensure:")
        print("1. Docker services are running: docker-compose ps")
        print("2. Orion-LD is accessible: curl http://localhost:1026/version")
        print("3. Firewall allows connection to the server")
        return 1
    
    print(f"[OK] Orion-LD is available")
    if version:
        orion_version = version.get('orion', {}).get('version', 'unknown')
        print(f"     Version: {orion_version}")
    
    # Clear entities if requested
    if args.clear:
        print("\n[WARNING] Clearing ALL entities...")
        deleted = delete_all_entities(orion_url, None, auth)
        print(f"[OK] Deleted {deleted} entities")
    elif args.clear_type:
        print(f"\n[WARNING] Clearing entities of type: {args.clear_type}")
        deleted = delete_all_entities(orion_url, args.clear_type, auth)
        print(f"[OK] Deleted {deleted} entities")
    
    # Determine which types to seed
    types_to_seed = args.types if args.types else list(ENTITY_FILES.keys())
    
    print(f"\n[INFO] Seeding entity types: {', '.join(types_to_seed)}")
    
    # Seed entities
    all_stats = {}
    
    for entity_type in types_to_seed:
        if entity_type not in ENTITY_FILES:
            print(f"\n[WARNING] Unknown entity type: {entity_type}")
            continue
        
        print(f"\n--- Seeding {entity_type} ---")
        
        all_entities = []
        for file in ENTITY_FILES[entity_type]:
            entities = load_entities_ndjson(file)
            all_entities.extend(entities)
        
        if not all_entities:
            print(f"[WARNING] No entities found for {entity_type}")
            continue
        
        stats = batch_create_entities(orion_url, all_entities, auth=auth)
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

