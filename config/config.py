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

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# ============================================================================
# API KEYS (from environment variables)
# ============================================================================

# OpenWeatherMap API Key (for weather data)
OWM_API_KEY = os.getenv("OWM_API_KEY", "")

# OpenAQ API Key (for air quality data)
OPENAQ_API_KEY = os.getenv("OPENAQ_API_KEY", "")


# ============================================================================
# HO CHI MINH CITY BOUNDARIES
# ============================================================================

# Bounding box for entire HCMC
# Format: (min_lat, min_lon, max_lat, max_lon)
HCMC_BBOX_FULL = (10.35, 106.36, 11.16, 106.95)

# Bounding box for central area (for quick testing/demo)
HCMC_BBOX_CENTER = (10.75, 106.65, 10.80, 106.70)

# HCMC center coordinates (for weather API)
HCMC_CENTER = {
    "lat": 10.776889,
    "lon": 106.700806,
    "name": "Ho Chi Minh City"
}


# ============================================================================
# OVERPASS API SETTINGS
# ============================================================================

# Overpass API endpoints (primary and alternative)
OVERPASS_API_URL = "https://overpass-api.de/api/interpreter"
OVERPASS_API_URL_ALT = "https://lz4.overpass-api.de/api/interpreter"

# Legacy alias (for backward compatibility)
OVERPASS_URL = OVERPASS_API_URL_ALT

# Timeout for Overpass queries (seconds)
OVERPASS_TIMEOUT = 25


# ============================================================================
# OPENAQ API SETTINGS
# ============================================================================

OPENAQ_BASE_URL = "https://api.openaq.org/v3"

# Radius to search for stations near HCMC (meters)
OPENAQ_RADIUS = 25000  # 25km (max allowed)


# ============================================================================
# OPENWEATHERMAP API SETTINGS
# ============================================================================

OWM_BASE_URL = "https://api.openweathermap.org/data/2.5"

# Units: metric (Celsius), imperial (Fahrenheit), standard (Kelvin)
OWM_UNITS = "metric"


# ============================================================================
# SYNTHETIC DATA GENERATION SETTINGS
# ============================================================================

# Distance between streetlights (meters)
STREETLIGHT_SPACING_MIN = 30
STREETLIGHT_SPACING_MAX = 50

# Generate streetlights only for these road types
STREETLIGHT_ROAD_TYPES = ["primary", "secondary", "tertiary", "residential"]


# ============================================================================
# NGSI-LD CONTEXT
# ============================================================================

# Context URL for NGSI-LD entities
NGSI_LD_CONTEXT = "https://raw.githubusercontent.com/smart-data-models/dataModel.UrbanMobility/master/context.jsonld"

# Base URN for UrbanReflex entities
URBANREFLEX_URN_PREFIX = "urn:ngsi-ld:UrbanReflex"


# ============================================================================
# CONSTANTS FOR CODE QUALITY
# ============================================================================

# Geographic constants
METERS_PER_DEGREE = 111000  # Approximate meters per degree at HCMC latitude

# Progress reporting
PROGRESS_INTERVAL = 500  # Print progress every N items

# Common strings
AREA_NAME = "Ho Chi Minh City, Vietnam"
SOURCE_OSM = "OpenStreetMap Overpass API"
SOURCE_OWM = "OpenWeatherMap API"
SOURCE_OPENAQ = "OpenAQ API v3"
SOURCE_SYNTHETIC = "Synthetic data generated from OSM road network"


# ============================================================================
# ORION-LD CONNECTION (from environment variables)
# ============================================================================

# Orion-LD API endpoint
ORION_LD_URL = os.getenv("ORION_LD_URL", "http://localhost:1026")
ORION_LD_USERNAME = os.getenv("ORION_LD_USERNAME", "urbanreflex_admin")
ORION_LD_PASSWORD = os.getenv("ORION_LD_PASSWORD", "")


# ============================================================================
# FILE PATHS
# ============================================================================

# Directory for raw data
RAW_DATA_DIR = "raw_data"

# Directory for NGSI-LD entities
NGSI_LD_DIR = "ngsi_ld_entities"

# Directory for JSON schemas
SCHEMAS_DIR = "schemas"

# Directory for examples
EXAMPLES_DIR = "examples"
