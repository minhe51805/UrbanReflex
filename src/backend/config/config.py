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
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

# Load environment variables
load_dotenv()

# Database configuration
MONGO_ROOT_USERNAME = os.getenv("MONGO_ROOT_USERNAME", "urbanreflex_admin")
MONGO_ROOT_PASSWORD = os.getenv("MONGO_ROOT_PASSWORD", "password")
MONGO_DATABASE = os.getenv("MONGO_DATABASE", "urbanreflex_db")
MONGO_HOST = os.getenv("MONGO_HOST", "localhost")
MONGO_PORT = int(os.getenv("MONGO_PORT", "27017"))

# Build MongoDB URL from components
MONGODB_URL = f"mongodb://{MONGO_ROOT_USERNAME}:{MONGO_ROOT_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DATABASE}?authSource=admin"
DATABASE_NAME = MONGO_DATABASE

# Orion-LD configuration
ORION_LD_HOST = os.getenv("ORION_LD_HOST", "localhost")
ORION_LD_PORT = int(os.getenv("ORION_LD_PORT", "1026"))
ORION_LD_URL = f"http://{ORION_LD_HOST}:{ORION_LD_PORT}"

# Authentication configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# AI Service configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "urbanreflex-index")
WEBSITE_CRAWL_URL = os.getenv("WEBSITE_CRAWL_URL", "https://urbanreflex.vn")

# Database client
client = None
database = None

def get_database() -> AsyncIOMotorDatabase:
    """Get MongoDB database instance."""
    global client, database
    if client is None:
        client = AsyncIOMotorClient(MONGODB_URL)
        database = client[DATABASE_NAME]
    return database