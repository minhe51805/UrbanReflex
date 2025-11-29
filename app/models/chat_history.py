"""
Author: Trần Tuấn Anh
Created at: 2025-11-29
Updated at: 2025-11-29
Description: Chat history model for UrbanReflex RAG system.
             Stores conversation context for better responses.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId


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