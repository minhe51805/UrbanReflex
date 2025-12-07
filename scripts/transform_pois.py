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
from datetime import datetime
from tqdm import tqdm

sys.path.append(str(Path(__file__).parent.parent))
from config.config import RAW_DATA_DIR, AREA_NAME, SOURCE_OSM
from config.data_model import (
    EntityType,
    create_entity_id,
    get_context,
    create_property,
    create_geo_property,
    validate_entity_id
)


# Mapping OSM categories to FiWARE PointOfInterest categories
CATEGORY_MAPPING = {
    'school': ['education', 'school', 'publicService'],
    'hospital': ['health', 'hospital', 'publicService', 'emergencyService'],
    'clinic': ['health', 'clinic', 'publicService'],
    'park': ['park', 'leisure', 'outdoors'],
    'parking': ['parking', 'transport'],
    'restaurant': ['restaurant', 'food', 'commercial'],
    'cafe': ['cafe', 'food', 'commercial'],
    'bank': ['bank', 'commercial', 'financialService'],
    'pharmacy': ['pharmacy', 'health', 'commercial'],
    'police': ['police', 'publicService', 'emergencyService'],
    'fire_station': ['fireStation', 'publicService', 'emergencyService'],
    'library': ['library', 'education', 'publicService'],
    'post_office': ['postOffice', 'publicService'],
    'bus_station': ['busStation', 'transport', 'publicService'],
    'fuel': ['fuelStation', 'transport', 'commercial'],
    'atm': ['atm', 'financialService'],
    'university': ['university', 'education', 'publicService'],
    'college': ['college', 'education', 'publicService']
}


def load_pois_geojson(filename):
    """
    Load POIs GeoJSON file
    
    Args:
        filename: Input filename in raw_data directory
        
    Returns:
        Dict with GeoJSON data
    """
    filepath = Path(RAW_DATA_DIR) / filename
    
    if not filepath.exists():
        raise FileNotFoundError(f"File not found: {filepath}")
    
    print(f"Loading POIs from {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    features = data.get('features', [])
    print(f"[OK] Loaded {len(features)} POI features")
    
    return data


def get_poi_categories(osm_category, amenity, leisure):
    """
    Get FiWARE categories from OSM tags
    
    Args:
        osm_category: Category from fetch script
        amenity: OSM amenity tag
        leisure: OSM leisure tag
        
    Returns:
        List of category strings
    """
    categories = []
    
    # Try category mapping first
    if osm_category and osm_category in CATEGORY_MAPPING:
        categories = CATEGORY_MAPPING[osm_category].copy()
    
    # Try amenity mapping
    elif amenity and amenity in CATEGORY_MAPPING:
        categories = CATEGORY_MAPPING[amenity].copy()
    
    # Try leisure mapping
    elif leisure:
        if leisure == 'park':
            categories = ['park', 'leisure', 'outdoors']
        else:
            categories = ['leisure', leisure]
    
    # Default fallback
    if not categories:
        if amenity:
            categories = [amenity, 'publicService']
        elif leisure:
            categories = ['leisure', leisure]
        else:
            categories = ['other']
    
    return categories


def create_clean_poi_id(osm_id, name):
    """
    Create a clean ID for POI entity
    
    Args:
        osm_id: OSM node/way ID
        name: POI name
        
    Returns:
        Clean ID string
    """
    if name and name != "Unnamed POI":
        # Use name if available
        clean_name = name.lower()
        clean_name = clean_name.replace(' ', '-')
        clean_name = clean_name.replace(',', '')
        clean_name = clean_name.replace('(', '')
        clean_name = clean_name.replace(')', '')
        clean_name = clean_name.replace('.', '')
        clean_name = clean_name.replace(':', '')
        
        # Remove Vietnamese characters for ID (keep in name property)
        replacements = {
            'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
            'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
            'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
            'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
            'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
            'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
            'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
            'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
            'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
            'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
            'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
            'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
            'đ': 'd'
        }
        
        for viet, latin in replacements.items():
            clean_name = clean_name.replace(viet, latin)
        
        # Limit length
        if len(clean_name) > 50:
            clean_name = clean_name[:50]
        
        return f"{clean_name}-{osm_id}"
    
    # Fallback to OSM ID
    return f"osm-{osm_id}"


def transform_poi_to_ngsi_ld(feature):
    """
    Transform OSM POI feature to NGSI-LD PointOfInterest entity
    
    Args:
        feature: GeoJSON feature from OSM
        
    Returns:
        Dict with NGSI-LD entity or None
    """
    props = feature.get('properties', {})
    geom = feature.get('geometry', {})
    
    # Get OSM ID
    osm_id = props.get('osm_id', feature.get('id'))
    if not osm_id:
        return None
    
    # Get coordinates
    coordinates = geom.get('coordinates', [])
    if not coordinates or len(coordinates) != 2:
        return None
    
    lon, lat = coordinates
    
    # Get POI properties
    name = props.get('name', 'Unnamed POI')
    category = props.get('category', 'unknown')
    amenity = props.get('amenity')
    leisure = props.get('leisure')
    
    # Create clean ID
    clean_id = create_clean_poi_id(osm_id, name)
    
    # Create NGSI-LD entity ID
    entity_id = create_entity_id(EntityType.POINT_OF_INTEREST, clean_id)
    
    if not validate_entity_id(entity_id):
        print(f"[WARNING] Invalid entity ID: {entity_id}")
        return None
    
    # Get categories
    categories = get_poi_categories(category, amenity, leisure)
    
    # Build NGSI-LD entity
    entity = {
        "id": entity_id,
        "type": EntityType.POINT_OF_INTEREST,
        "@context": get_context(EntityType.POINT_OF_INTEREST),
        "name": create_property(name),
        "location": create_geo_property([lon, lat], "Point"),
        "category": create_property(categories)
    }
    
    # Optional properties
    if props.get('name_en'):
        entity["alternateName"] = create_property(props['name_en'])
    
    # Contact information
    if props.get('phone'):
        entity["contactPoint"] = create_property({
            "telephone": props['phone']
        })
    
    if props.get('website'):
        entity["url"] = create_property(props['website'])
    
    # Opening hours
    if props.get('opening_hours'):
        entity["openingHours"] = create_property(props['opening_hours'])
    
    # Accessibility
    if props.get('wheelchair'):
        wheelchair_accessible = props['wheelchair'] in ['yes', 'true', 'designated']
        entity["wheelchairAccessible"] = create_property(wheelchair_accessible)
    
    # Operator
    if props.get('operator'):
        entity["managedBy"] = create_property(props['operator'])
    
    # Address
    address = {
        "addressLocality": AREA_NAME,
        "addressCountry": "VN"
    }
    
    entity["address"] = create_property(address)
    
    # Metadata
    entity["dateModified"] = create_property(
        datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
    )
    
    entity["dataProvider"] = create_property(SOURCE_OSM)
    
    osm_type = props.get('osm_type', 'node')
    entity["source"] = create_property(f"OSM {osm_type}/{osm_id}")
    
    return entity


def transform_all_pois(pois_geojson):
    """
    Transform all POI features to NGSI-LD entities
    
    Args:
        pois_geojson: GeoJSON FeatureCollection
        
    Returns:
        List of NGSI-LD entities
    """
    features = pois_geojson.get('features', [])
    
    print(f"\nTransforming {len(features)} POIs to NGSI-LD...")
    
    entities = []
    skipped = 0
    
    for feature in tqdm(features, desc="Transforming", unit="POIs"):
        entity = transform_poi_to_ngsi_ld(feature)
        
        if entity:
            entities.append(entity)
        else:
            skipped += 1
    
    print(f"\n[OK] Transformed {len(entities)} entities")
    if skipped > 0:
        print(f"[WARNING] Skipped {skipped} invalid features")
    
    return entities


def save_entities(entities, output_file):
    """
    Save NGSI-LD entities to file
    
    Args:
        entities: List of NGSI-LD entities
        output_file: Output filename
    """
    output_dir = Path("ngsi_ld_entities")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_path = output_dir / output_file
    
    # Create JSON-LD document
    document = {
        "@context": get_context(EntityType.POINT_OF_INTEREST),
        "@graph": entities
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(document, f, indent=2, ensure_ascii=False)
    
    print(f"\n[SAVED] {output_path}")
    
    # Also save as NDJSON
    ndjson_path = output_dir / output_file.replace('.jsonld', '.ndjson')
    with open(ndjson_path, 'w', encoding='utf-8') as f:
        for entity in entities:
            f.write(json.dumps(entity, ensure_ascii=False) + '\n')
    
    print(f"[SAVED] {ndjson_path} (NDJSON format for batch loading)")


def print_statistics(entities):
    """
    Print transformation statistics
    
    Args:
        entities: List of NGSI-LD entities
    """
    print("\n" + "=" * 70)
    print("TRANSFORMATION STATISTICS:")
    print("=" * 70)
    
    # Count by primary category
    by_category = {}
    with_phone = 0
    with_website = 0
    with_hours = 0
    with_wheelchair = 0
    
    for entity in entities:
        categories = entity.get('category', {}).get('value', [])
        if isinstance(categories, list) and len(categories) > 0:
            primary = categories[0]
        else:
            primary = 'unknown'
        
        by_category[primary] = by_category.get(primary, 0) + 1
        
        if 'contactPoint' in entity:
            with_phone += 1
        if 'url' in entity:
            with_website += 1
        if 'openingHours' in entity:
            with_hours += 1
        if 'wheelchairAccessible' in entity:
            with_wheelchair += 1
    
    print(f"\nTotal entities: {len(entities)}")
    print(f"With phone: {with_phone} ({with_phone/len(entities)*100:.1f}%)")
    print(f"With website: {with_website} ({with_website/len(entities)*100:.1f}%)")
    print(f"With opening hours: {with_hours} ({with_hours/len(entities)*100:.1f}%)")
    print(f"With wheelchair info: {with_wheelchair} ({with_wheelchair/len(entities)*100:.1f}%)")
    
    print("\nBy Primary Category:")
    for cat, count in sorted(by_category.items(), key=lambda x: x[1], reverse=True):
        percentage = count / len(entities) * 100
        print(f"  {cat:20s}: {count:5d} ({percentage:5.1f}%)")
    
    print("=" * 70)


def validate_sample(entities, sample_size=3):
    """
    Validate and display sample entities
    
    Args:
        entities: List of NGSI-LD entities
        sample_size: Number of samples to display
    """
    print(f"\n{'=' * 70}")
    print(f"SAMPLE ENTITIES (first {sample_size}):")
    print("=" * 70)
    
    for i, entity in enumerate(entities[:sample_size], 1):
        name = entity.get('name', {}).get('value', 'Unknown')
        categories = entity.get('category', {}).get('value', [])
        
        print(f"\n{i}. {entity['id']}")
        try:
            print(f"   Name: {name}")
        except UnicodeEncodeError:
            print(f"   Name: {name.encode('ascii', 'replace').decode('ascii')}")
        
        if isinstance(categories, list):
            print(f"   Categories: {', '.join(categories[:3])}")
        
        # Validate structure
        required_fields = ['id', 'type', '@context', 'name', 'location', 'category']
        missing = [f for f in required_fields if f not in entity]
        
        if missing:
            print(f"   [WARNING] Missing required fields: {missing}")
        else:
            print(f"   [OK] All required fields present")


def main():
    """Main execution"""
    print("=" * 70)
    print("UrbanReflex - POIs to NGSI-LD Transformer")
    print("=" * 70)
    
    # Check command-line argument
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    else:
        input_file = "osm_pois_center.json"
    
    try:
        # Load POIs
        pois_geojson = load_pois_geojson(input_file)
        
        # Transform to NGSI-LD
        entities = transform_all_pois(pois_geojson)
        
        if not entities:
            print("[ERROR] No valid entities created")
            return 1
        
        # Validate samples
        validate_sample(entities)
        
        # Print statistics
        print_statistics(entities)
        
        # Save output
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"point_of_interest_{timestamp}.jsonld"
        save_entities(entities, output_file)
        
        # Also save as latest
        save_entities(entities, "point_of_interest_latest.jsonld")
        
        print(f"\n[SUCCESS] Transformation completed!")
        print(f"\nOutput files:")
        print(f"   - ngsi_ld_entities/{output_file}")
        print(f"   - ngsi_ld_entities/point_of_interest_latest.jsonld")
        print(f"   - ngsi_ld_entities/point_of_interest_latest.ndjson")
        
        return 0
        
    except FileNotFoundError as e:
        print(f"[ERROR] {e}")
        print("\nPlease run fetch_osm_pois.py first to collect POI data.")
        return 1
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit(main())

