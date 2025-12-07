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

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from bson import ObjectId

# Load environment variables
load_dotenv()


class ChatMessage(BaseModel):
    """
    Model for individual chat message.
    """
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Message timestamp")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "role": "user",
                "content": "How do I report a streetlight issue?",
                "timestamp": "2025-11-29T15:00:00.000Z"
            }
        }
    }


class ChatSession(BaseModel):
    """
    Model for chat session with history.
    """
    id: Optional[str] = Field(None, alias="_id", description="Session ID")
    session_id: str = Field(..., description="Unique session identifier")
    user_id: Optional[str] = Field(None, description="User ID if authenticated")
    messages: List[ChatMessage] = Field(default_factory=list, description="Chat message history")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Session creation time")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Last update time")
    
    model_config = {
        "populate_by_name": True,
        "json_encoders": {ObjectId: str}
    }