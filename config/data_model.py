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

# ==============================================================================
# ENTITY TYPES (NGSI-LD)
# ==============================================================================

class EntityType:
    """NGSI-LD entity type constants"""
    ROAD_SEGMENT = "RoadSegment"
    WEATHER_OBSERVED = "WeatherObserved"
    AIR_QUALITY_OBSERVED = "AirQualityObserved"
    STREETLIGHT = "Streetlight"
    STREETLIGHT_CONTROL_CABINET = "StreetlightControlCabinet"
    POINT_OF_INTEREST = "PointOfInterest"
    CITIZEN_REPORT = "CitizenReport"


# ==============================================================================
# ID PREFIXES
# ==============================================================================

class IDPrefix:
    """URN prefixes for entity IDs"""
    BASE = "urn:ngsi-ld"
    ROAD_SEGMENT = f"{BASE}:RoadSegment:HCMC"
    WEATHER = f"{BASE}:WeatherObserved:HCMC"
    AIR_QUALITY = f"{BASE}:AirQualityObserved:HCMC"
    STREETLIGHT = f"{BASE}:Streetlight:HCMC"
    STREETLIGHT_CABINET = f"{BASE}:StreetlightControlCabinet:HCMC"
    POI = f"{BASE}:PointOfInterest:HCMC"
    CITIZEN_REPORT = f"{BASE}:CitizenReport:HCMC"


# ==============================================================================
# NGSI-LD CONTEXTS
# ==============================================================================

# Core NGSI-LD context (always required)
NGSI_LD_CORE_CONTEXT = "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld"

# SOSA/SSN Ontology contexts (W3C)
SOSA_CONTEXT = "https://www.w3.org/ns/sosa/context.jsonld"
SSN_CONTEXT = "https://www.w3.org/ns/ssn/context.jsonld"

# FiWARE Smart Data Model contexts
FIWARE_CONTEXTS = {
    EntityType.WEATHER_OBSERVED: [
        NGSI_LD_CORE_CONTEXT,
        SOSA_CONTEXT,  # SOSA/SSN for observations
        "https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld"
    ],
    EntityType.AIR_QUALITY_OBSERVED: [
        NGSI_LD_CORE_CONTEXT,
        SOSA_CONTEXT,  # SOSA/SSN for observations
        "https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld"
    ],
    EntityType.STREETLIGHT: [
        NGSI_LD_CORE_CONTEXT,
        "https://smart-data-models.github.io/dataModel.Streetlighting/context.jsonld"
    ],
    EntityType.STREETLIGHT_CONTROL_CABINET: [
        NGSI_LD_CORE_CONTEXT,
        "https://smart-data-models.github.io/dataModel.Streetlighting/context.jsonld"
    ],
    EntityType.POINT_OF_INTEREST: [
        NGSI_LD_CORE_CONTEXT,
        "https://raw.githubusercontent.com/smart-data-models/dataModel.PointOfInterest/master/context.jsonld"
    ],
    EntityType.ROAD_SEGMENT: [
        NGSI_LD_CORE_CONTEXT,
        SOSA_CONTEXT,  # SOSA/SSN for FeatureOfInterest
        "https://smart-data-models.github.io/dataModel.Transportation/context.jsonld"
    ],
    EntityType.CITIZEN_REPORT: [NGSI_LD_CORE_CONTEXT]
}


# ==============================================================================
# RELATIONSHIP TYPES
# ==============================================================================

class RelationshipType:
    """Relationship property names"""
    HAS_STREETLIGHT = "hasStreetlight"
    NEARBY_POI = "nearbyPOI"
    REF_ROAD_SEGMENT = "refRoadSegment"
    REF_STREETLIGHT = "refStreetlight"
    REF_POI = "refPOI"


# ==============================================================================
# POI CATEGORIES
# ==============================================================================

class POICategory:
    """Point of Interest category constants"""
    SCHOOL = "school"
    HOSPITAL = "hospital"
    PARK = "park"
    PARKING = "parking"


# Mapping OSM tags to POI categories
OSM_TO_POI_CATEGORY = {
    "amenity=school": POICategory.SCHOOL,
    "amenity=hospital": POICategory.HOSPITAL,
    "leisure=park": POICategory.PARK,
    "amenity=parking": POICategory.PARKING
}


# ==============================================================================
# CITIZEN REPORT CATEGORIES
# ==============================================================================

class CitizenReportCategory:
    """Citizen report issue categories"""
    STREETLIGHT_BROKEN = "streetlight_broken"
    STREETLIGHT_DARK = "streetlight_dark"
    DRAINAGE_BLOCKED = "drainage_blocked"
    POTHOLE = "pothole"
    OTHER = "other"


# ==============================================================================
# CITIZEN REPORT STATUS
# ==============================================================================

class CitizenReportStatus:
    """Citizen report processing status"""
    SUBMITTED = "submitted"
    ACKNOWLEDGED = "acknowledged"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


# ==============================================================================
# STREETLIGHT STATUS
# ==============================================================================

class StreetlightStatus:
    """Streetlight operational status"""
    OK = "ok"
    DEFECTIVE_LAMP = "defectiveLamp"
    BROKEN_LAMP = "brokenLamp"


class StreetlightPowerState:
    """Streetlight power state"""
    ON = "on"
    OFF = "off"
    LOW = "low"


# ==============================================================================
# ROAD TYPES
# ==============================================================================

class RoadType:
    """OSM highway types"""
    PRIMARY = "primary"
    SECONDARY = "secondary"
    TERTIARY = "tertiary"
    RESIDENTIAL = "residential"
    UNCLASSIFIED = "unclassified"


# Road types that should have streetlights (for synthetic generation)
STREETLIGHT_ROAD_TYPES = [
    RoadType.PRIMARY,
    RoadType.SECONDARY,
    RoadType.TERTIARY,
    RoadType.RESIDENTIAL
]


# ==============================================================================
# SPATIAL THRESHOLDS
# ==============================================================================

class SpatialThreshold:
    """Distance thresholds for spatial relationships (in meters)"""
    WEATHER_TO_ROAD = 5000  # 5km - weather data applies to nearby roads
    AIR_QUALITY_TO_ROAD = 2000  # 2km - air quality more localized
    POI_NEARBY = 100  # 100m - for "nearby" POI
    CITIZEN_REPORT_SNAP = 50  # 50m - snap report to nearest road


# ==============================================================================
# SYNTHETIC DATA GENERATION
# ==============================================================================

class SyntheticConfig:
    """Configuration for synthetic data generation"""
    STREETLIGHT_SPACING_MIN = 30  # meters
    STREETLIGHT_SPACING_MAX = 50  # meters


# ==============================================================================
# HELPER FUNCTIONS
# ==============================================================================

def get_context(entity_type: str) -> list:
    """
    Get NGSI-LD context for entity type
    
    Args:
        entity_type: Entity type constant from EntityType class
        
    Returns:
        List of context URLs
    """
    return FIWARE_CONTEXTS.get(entity_type, [NGSI_LD_CORE_CONTEXT])


def create_entity_id(entity_type: str, suffix: str) -> str:
    """
    Create NGSI-LD entity ID in URN format
    
    Args:
        entity_type: Entity type constant from EntityType class
        suffix: Unique suffix for the entity
        
    Returns:
        Complete entity ID in format: urn:ngsi-ld:EntityType:HCMC-{suffix}
    """
    return f"{IDPrefix.BASE}:{entity_type}:HCMC-{suffix}"


def create_property(value, observed_at=None, unit_code=None):
    """
    Create NGSI-LD Property object
    
    Args:
        value: Property value
        observed_at: Optional ISO 8601 timestamp
        unit_code: Optional unit code (e.g., "CEL" for Celsius)
        
    Returns:
        Dict with NGSI-LD Property structure
    """
    prop = {
        "type": "Property",
        "value": value
    }
    
    if observed_at:
        prop["observedAt"] = observed_at
        
    if unit_code:
        prop["unitCode"] = unit_code
        
    return prop


def create_geo_property(coordinates, geo_type="Point"):
    """
    Create NGSI-LD GeoProperty object
    
    Args:
        coordinates: [lon, lat] for Point, or array of coordinates for LineString/Polygon
        geo_type: GeoJSON geometry type (Point, LineString, Polygon)
        
    Returns:
        Dict with NGSI-LD GeoProperty structure
    """
    return {
        "type": "GeoProperty",
        "value": {
            "type": geo_type,
            "coordinates": coordinates
        }
    }


def create_relationship(target_entity_id):
    """
    Create NGSI-LD Relationship object
    
    Args:
        target_entity_id: ID of target entity (URN format)
        
    Returns:
        Dict with NGSI-LD Relationship structure
    """
    return {
        "type": "Relationship",
        "object": target_entity_id
    }


# ==============================================================================
# VALIDATION
# ==============================================================================

def validate_entity_id(entity_id: str) -> bool:
    """
    Validate entity ID format
    
    Args:
        entity_id: Entity ID to validate
        
    Returns:
        True if valid URN format, False otherwise
    """
    return entity_id.startswith("urn:ngsi-ld:")


def validate_coordinates(coordinates) -> bool:
    """
    Validate GeoJSON coordinates
    
    Args:
        coordinates: Coordinates to validate (Point: [lon, lat])
        
    Returns:
        True if valid, False otherwise
    """
    if not isinstance(coordinates, list):
        return False
        
    if len(coordinates) != 2:
        return False
        
    lon, lat = coordinates
    
    # Longitude: -180 to 180
    if not (-180 <= lon <= 180):
        return False
        
    # Latitude: -90 to 90
    if not (-90 <= lat <= 90):
        return False
        
    return True


def add_sosa_ssn_types(entity: dict, entity_type: str) -> dict:
    """
    Add SOSA/SSN @type annotations to entity for explicit SOSA/SSN compliance.
    
    According to SOSA/SSN ontology:
    - WeatherObserved and AirQualityObserved implement sosa:Observation
    - RoadSegment implements sosa:FeatureOfInterest
    - dateObserved maps to sosa:resultTime
    - location maps to sosa:hasFeatureOfInterest
    - Properties map to sosa:hasResult
    
    Args:
        entity: NGSI-LD entity dict
        entity_type: Entity type constant from EntityType class
        
    Returns:
        Entity dict with @type added
    """
    # Ensure @type exists as a list
    if "@type" not in entity:
        entity["@type"] = [entity.get("type", entity_type)]
    elif not isinstance(entity["@type"], list):
        entity["@type"] = [entity["@type"]]
    
    # Add SOSA/SSN types based on entity type
    if entity_type == EntityType.WEATHER_OBSERVED:
        if "sosa:Observation" not in entity["@type"]:
            entity["@type"].append("sosa:Observation")
        # Map dateObserved to sosa:resultTime
        if "dateObserved" in entity and isinstance(entity["dateObserved"], dict):
            if "@type" not in entity["dateObserved"]:
                entity["dateObserved"]["@type"] = "sosa:resultTime"
    
    elif entity_type == EntityType.AIR_QUALITY_OBSERVED:
        if "sosa:Observation" not in entity["@type"]:
            entity["@type"].append("sosa:Observation")
        # Map dateObserved to sosa:resultTime
        if "dateObserved" in entity and isinstance(entity["dateObserved"], dict):
            if "@type" not in entity["dateObserved"]:
                entity["dateObserved"]["@type"] = "sosa:resultTime"
        # Map location to sosa:hasFeatureOfInterest
        if "location" in entity and isinstance(entity["location"], dict):
            if "@type" not in entity["location"]:
                entity["location"]["@type"] = "sosa:hasFeatureOfInterest"
    
    elif entity_type == EntityType.ROAD_SEGMENT:
        if "sosa:FeatureOfInterest" not in entity["@type"]:
            entity["@type"].append("sosa:FeatureOfInterest")
    
    return entity

