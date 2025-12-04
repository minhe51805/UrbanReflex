"""
Author: Hồ Viết Hiệp
Created at: 2025-11-13
Updated at: 2025-11-13
Description: Script to download JSON Schemas from FiWARE Smart Data Models repository.
             Downloads schemas for WeatherObserved, AirQualityObserved, Streetlight, PointOfInterest.
"""

import requests
import json
import os
from pathlib import Path

# FiWARE Smart Data Models base URL
FIWARE_BASE_URL = "https://raw.githubusercontent.com/smart-data-models"

# Schemas to download
SCHEMAS = {
    "WeatherObserved": {
        "repo": "dataModel.Weather",
        "entity": "WeatherObserved",
        "url": f"{FIWARE_BASE_URL}/dataModel.Weather/master/WeatherObserved/schema.json"
    },
    "AirQualityObserved": {
        "repo": "dataModel.Environment",
        "entity": "AirQualityObserved",
        "url": f"{FIWARE_BASE_URL}/dataModel.Environment/master/AirQualityObserved/schema.json"
    },
    "Streetlight": {
        "repo": "dataModel.Streetlighting",
        "entity": "Streetlight",
        "url": f"{FIWARE_BASE_URL}/dataModel.Streetlighting/master/Streetlight/schema.json"
    },
    "StreetlightControlCabinet": {
        "repo": "dataModel.Streetlighting",
        "entity": "StreetlightControlCabinet",
        "url": f"{FIWARE_BASE_URL}/dataModel.Streetlighting/master/StreetlightControlCabinet/schema.json"
    },
    "PointOfInterest": {
        "repo": "dataModel.PointOfInterest",
        "entity": "PointOfInterest",
        "url": f"{FIWARE_BASE_URL}/dataModel.PointOfInterest/master/PointOfInterest/schema.json"
    }
}

# Output directory
SCHEMAS_DIR = Path("schemas")
SCHEMAS_DIR.mkdir(exist_ok=True)


def download_schema(name, info):
    """Download a single schema from FiWARE repository"""
    print(f"Downloading {name} schema...")
    
    try:
        response = requests.get(info["url"], timeout=30)
        response.raise_for_status()
        
        # Parse JSON to validate
        schema = response.json()
        
        # Save to file
        output_file = SCHEMAS_DIR / f"{name}_schema.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(schema, f, indent=2, ensure_ascii=False)
        
        print(f"[OK] {name} schema saved to {output_file}")
        return True
        
    except requests.RequestException as e:
        print(f"[ERROR] Failed to download {name}: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"[ERROR] Invalid JSON for {name}: {e}")
        return False


def main():
    """Download all schemas"""
    print("=" * 60)
    print("FiWARE Smart Data Models - Schema Downloader")
    print("=" * 60)
    print()
    
    success_count = 0
    total_count = len(SCHEMAS)
    
    for name, info in SCHEMAS.items():
        if download_schema(name, info):
            success_count += 1
        print()
    
    print("=" * 60)
    print(f"Downloaded {success_count}/{total_count} schemas successfully")
    print("=" * 60)
    
    if success_count < total_count:
        print("\n[WARNING] Some schemas failed to download. Check URLs or network connection.")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())

