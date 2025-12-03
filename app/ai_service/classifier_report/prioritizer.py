"""
Author: Trần Tuấn Anh
Created at: 2025-11-27
Updated at: 2025-12-03
Description: A module to adjust CitizenReport priority based on proximity to sensitive POIs.
             Uses weighted distance decay algorithm with time-aware and context-aware scoring.
"""

import json
import math
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple

import requests

# Try to import from app package first, fallback to direct import
try:
    from app.ai_service.classifier_report.ai_config import (
        get_category_weights,
        get_time_zones,
        get_context_multipliers,
        get_distance_decay_config,
        get_priority_thresholds,
        get_timezone
    )
except ImportError:
    from ai_config import (
        get_category_weights,
        get_time_zones,
        get_context_multipliers,
        get_distance_decay_config,
        get_priority_thresholds,
        get_timezone
    )

# Try to import timezone support
try:
    from zoneinfo import ZoneInfo
    TIMEZONE_AVAILABLE = True
except ImportError:
    try:
        import pytz
        TIMEZONE_AVAILABLE = True
    except ImportError:
        TIMEZONE_AVAILABLE = False

# Configuration constants
ORION_LD_URL = "http://103.178.233.233:1026/"  # Real Orion-LD URL

# Entity types for NGSI-LD
class EntityType:
    POINT_OF_INTEREST = "PointOfInterest"

# Context helper
def get_context(entity_type: str) -> List[str]:
    """Get context URL for entity type."""
    contexts = {
        "PointOfInterest": ["https://raw.githubusercontent.com/smart-data-models/dataModel.PointOfInterest/master/context.jsonld"]
    }
    return contexts.get(entity_type, [])


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points on Earth using Haversine formula.
    
    Args:
        lat1, lon1: Latitude and longitude of first point (in degrees)
        lat2, lon2: Latitude and longitude of second point (in degrees)
        
    Returns:
        Distance in meters
    """
    # Earth radius in meters
    R = 6371000
    
    # Convert to radians
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    # Haversine formula
    a = math.sin(delta_phi / 2) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c


def calculate_distance_score(distance: float, decay_factor: float) -> float:
    """
    Calculate distance score using exponential decay.
    
    Args:
        distance: Distance in meters
        decay_factor: Decay factor (default: 200m)
        
    Returns:
        Score between 0.0 and 1.0
    """
    if distance <= 0:
        return 1.0
    
    # Exponential decay: score = exp(-distance / decay_factor)
    score = math.exp(-distance / decay_factor)
    return max(0.0, min(1.0, score))


def get_category_weight(poi_category: str) -> float:
    """
    Get weight for a POI category.
    
    Args:
        poi_category: POI category (e.g., "school", "hospital")
        
    Returns:
        Weight (default: 1.0 if not found)
    """
    weights = get_category_weights()
    return weights.get(poi_category, 1.0)


def get_context_multiplier(report_category: str, poi_category: str) -> float:
    """
    Get context multiplier based on report category and POI category combination.
    
    Args:
        report_category: Report category (e.g., "road_damage")
        poi_category: POI category (e.g., "school")
        
    Returns:
        Multiplier (default: 1.0 if not found)
    """
    multipliers = get_context_multipliers()
    key = f"{report_category}+{poi_category}"
    return multipliers.get(key, 1.0)


def get_time_multiplier(poi_category: str, current_time: datetime) -> float:
    """
    Get time multiplier based on current time and POI category.
    
    Args:
        poi_category: POI category (e.g., "school", "hospital")
        current_time: Current datetime
        
    Returns:
        Multiplier (default: 1.0)
    """
    time_zones = get_time_zones()
    hour = current_time.hour
    minute = current_time.minute
    current_minutes = hour * 60 + minute
    
    multiplier = 1.0
    
    # Check school dismissal times
    if poi_category == "school":
        school_dismissal = time_zones.get("school_dismissal", {})
        for period in ["morning", "afternoon"]:
            period_config = school_dismissal.get(period, {})
            if period_config:
                start_str = period_config.get("start", "00:00")
                end_str = period_config.get("end", "23:59")
                period_multiplier = period_config.get("multiplier", 1.0)
                
                start_h, start_m = map(int, start_str.split(":"))
                end_h, end_m = map(int, end_str.split(":"))
                start_minutes = start_h * 60 + start_m
                end_minutes = end_h * 60 + end_m
                
                if start_minutes <= current_minutes <= end_minutes:
                    multiplier = max(multiplier, period_multiplier)
    
    # Check rush hour
    rush_hour = time_zones.get("rush_hour", {})
    for period in ["morning", "evening"]:
        period_config = rush_hour.get(period, {})
        if period_config:
            start_str = period_config.get("start", "00:00")
            end_str = period_config.get("end", "23:59")
            period_multiplier = period_config.get("multiplier", 1.0)
            
            start_h, start_m = map(int, start_str.split(":"))
            end_h, end_m = map(int, end_str.split(":"))
            start_minutes = start_h * 60 + start_m
            end_minutes = end_h * 60 + end_m
            
            if start_minutes <= current_minutes <= end_minutes:
                multiplier = max(multiplier, period_multiplier)
    
    # Check hospital peak hours
    if poi_category == "hospital":
        hospital_peak = time_zones.get("hospital_peak", {})
        if hospital_peak:
            start_str = hospital_peak.get("start", "00:00")
            end_str = hospital_peak.get("end", "23:59")
            peak_multiplier = hospital_peak.get("multiplier", 1.0)
            
            start_h, start_m = map(int, start_str.split(":"))
            end_h, end_m = map(int, end_str.split(":"))
            start_minutes = start_h * 60 + start_m
            end_minutes = end_h * 60 + end_m
            
            if start_minutes <= current_minutes <= end_minutes:
                multiplier = max(multiplier, peak_multiplier)
    
    return multiplier


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
        "limit": 10,
    }

    try:
        resp = requests.get(f"{ORION_LD_URL}/ngsi-ld/v1/entities", params=params, headers=headers, timeout=15)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException:
        return []


def calculate_poi_score(
    poi: dict,
    report_location: dict,
    report_category: str,
    current_time: datetime
) -> Tuple[float, str]:
    """
    Calculate priority score for a single POI.
    
    Args:
        poi: POI entity
        report_location: Report location (with coordinates)
        report_category: Report category
        current_time: Current datetime
        
    Returns:
        Tuple of (score, poi_name)
    """
    # Get POI location
    poi_location = poi.get("location", {})
    if not poi_location or "coordinates" not in poi_location:
        return (0.0, poi.get("name", "Unnamed POI"))
    
    # Calculate distance
    report_coords = report_location["coordinates"]
    poi_coords = poi_location["coordinates"]
    distance = haversine_distance(
        report_coords[1], report_coords[0],  # lat, lon
        poi_coords[1], poi_coords[0]
    )
    
    # Get distance decay config
    decay_config = get_distance_decay_config()
    decay_factor = decay_config.get("decay_factor", 200)
    
    # Calculate distance score
    distance_score = calculate_distance_score(distance, decay_factor)
    
    # Get POI category (first sensitive category found)
    poi_categories = poi.get("category", [])
    category_weights = get_category_weights()
    sensitive_categories = [cat for cat in poi_categories if cat in category_weights]
    
    if not sensitive_categories:
        return (0.0, poi.get("name", "Unnamed POI"))
    
    # Use first sensitive category
    poi_category = sensitive_categories[0]
    
    # Get category weight
    category_weight = get_category_weight(poi_category)
    
    # Get context multiplier
    context_multiplier = get_context_multiplier(report_category, poi_category)
    
    # Get time multiplier
    time_multiplier = get_time_multiplier(poi_category, current_time)
    
    # Calculate final score
    final_score = distance_score * category_weight * context_multiplier * time_multiplier
    
    return (final_score, poi.get("name", "Unnamed POI"))


def check_poi_proximity(location: dict, report_category: str = None) -> dict:
    """
    Checks if a location is near sensitive POIs and calculates priority score.
    
    Args:
        location: Report location (with coordinates)
        report_category: Report category (optional, for context-aware scoring)
        
    Returns:
        Dictionary with:
        - is_sensitive: bool
        - score: float (0.0 - 1.0)
        - priority_boost: str ("high", "medium", "none")
        - reason: str
        - nearby_pois: list of POI names
    """
    if not location or "coordinates" not in location:
        return {
            "is_sensitive": False,
            "score": 0.0,
            "priority_boost": "none",
            "reason": "No location provided",
            "nearby_pois": []
        }
    
    # Get current time (with timezone if available)
    if TIMEZONE_AVAILABLE:
        try:
            from zoneinfo import ZoneInfo
            tz = ZoneInfo(get_timezone())
            current_time = datetime.now(tz)
        except:
            try:
                import pytz
                tz = pytz.timezone(get_timezone())
                current_time = datetime.now(tz)
            except:
                current_time = datetime.now()
    else:
        current_time = datetime.now()
    
    # Get distance decay config
    decay_config = get_distance_decay_config()
    max_radius = decay_config.get("max_radius", 500)
    
    # Fetch nearby POIs
    nearby_pois = fetch_nearby_pois(location, max_radius)
    
    if not nearby_pois:
        return {
            "is_sensitive": False,
            "score": 0.0,
            "priority_boost": "none",
            "reason": "No sensitive POIs nearby",
            "nearby_pois": []
        }
    
    # Filter sensitive POIs and calculate scores
    category_weights = get_category_weights()
    sensitive_pois = []
    poi_scores = []
    
    for poi in nearby_pois:
        poi_categories = poi.get("category", [])
        if any(cat in category_weights for cat in poi_categories):
            sensitive_pois.append(poi)
            score, poi_name = calculate_poi_score(
                poi,
                location,
                report_category or "unknown",
                current_time
            )
            if score > 0:
                poi_scores.append((score, poi_name, poi))
    
    if not poi_scores:
        return {
            "is_sensitive": False,
            "score": 0.0,
            "priority_boost": "none",
            "reason": "No sensitive POIs found in range",
            "nearby_pois": []
        }
    
    # Get highest scoring POI
    poi_scores.sort(reverse=True, key=lambda x: x[0])
    best_score, best_poi_name, best_poi = poi_scores[0]
    
    # Get priority thresholds
    thresholds = get_priority_thresholds()
    high_threshold = thresholds.get("high", 0.6)
    medium_threshold = thresholds.get("medium", 0.4)
    
    # Determine priority boost
    if best_score >= high_threshold:
        priority_boost = "high"
    elif best_score >= medium_threshold:
        priority_boost = "medium"
    else:
        priority_boost = "none"
    
    # Build reason
    nearby_names = [name for _, name, _ in poi_scores[:3]]  # Top 3
    reason = f"Proximity to sensitive POIs: {', '.join(nearby_names)} (score: {best_score:.2f})"
    
    return {
        "is_sensitive": best_score > 0,
        "score": round(best_score, 3),
        "priority_boost": priority_boost,
        "reason": reason,
        "nearby_pois": nearby_names
    }