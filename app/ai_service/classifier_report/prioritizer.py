"""
Author: Trần Tuấn Anh
Created at: 2025-11-27
Updated at: 2025-11-30
Description: A module to adjust CitizenReport priority based on proximity to sensitive POIs.
"""

import sys
import json
from pathlib import Path

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

import requests

# Add project root to path to import config
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

from config.config import ORION_LD_URL
from config.data_model import EntityType, get_context

# Constants
SENSITIVE_POI_CATEGORIES = ["school", "hospital", "emergencyService"]
PRIORITY_UPGRADE_RADIUS_METERS = 500  # Bán kính 500m quanh trường học/bệnh viện


def build_link_header(entity_type: str) -> dict:
    """Builds the Link header required for NGSI-LD requests."""
    contexts = get_context(entity_type)
    link_str = ", ".join(
        f'<{ctx}>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
        for ctx in contexts
    )
    return {"Link": link_str}


def fetch_nearby_pois(location: dict, radius: int) -> list:
    """Fetches POIs near a given location."""
    if not location or "coordinates" not in location:
        return []

    # PointOfInterest requires a single, specific context header.
    headers = {
        "Link": '<https://raw.githubusercontent.com/smart-data-models/dataModel.PointOfInterest/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    }
    params = {
        "type": EntityType.POINT_OF_INTEREST,
        "georel": f"near;maxDistance=={radius}",
        "geometry": "Point",
        "coordinates": json.dumps(location["coordinates"]),
        "options": "keyValues",
        "limit": 10, # Chỉ cần tìm 1 POI là đủ để nâng ưu tiên
    }

    try:
        resp = requests.get(f"{ORION_LD_URL}/ngsi-ld/v1/entities", params=params, headers=headers, timeout=15)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException:
        return []


def check_poi_proximity(location: dict) -> dict:
    """Checks if a location is near a sensitive POI and returns the findings."""
    if not location or "coordinates" not in location:
        return {"is_sensitive": False, "reason": "No location provided"}

    nearby_pois = fetch_nearby_pois(location, PRIORITY_UPGRADE_RADIUS_METERS)

    sensitive_pois_found = []
    for poi in nearby_pois:
        poi_categories = poi.get("category", [])
        if any(cat in poi_categories for cat in SENSITIVE_POI_CATEGORIES):
            sensitive_pois_found.append(poi.get("name", "Unnamed POI"))

    if sensitive_pois_found:
        reason = f"Proximity to sensitive POIs: {', '.join(sensitive_pois_found)}"
        return {"is_sensitive": True, "reason": reason}

    return {"is_sensitive": False, "reason": "No sensitive POIs nearby"}

