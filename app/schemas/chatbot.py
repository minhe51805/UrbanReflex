"""
Author: Trần Tuấn Anh
Created at: 2025-11-28
Updated at: 2025-11-28
Description: Pydantic models for chatbot request/response validation.
             Includes schemas for chat queries, responses, and API documentation.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime


class ChatRequest(BaseModel):
    """
    Request model for chatbot interactions.
    """
    query: str = Field(..., min_length=1, max_length=1000, description="User's question or query")
    session_id: Optional[str] = Field(None, description="Optional session identifier for conversation tracking")
    context_limit: Optional[int] = Field(5, ge=1, le=10, description="Maximum number of context documents to retrieve")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "query": "How do I report a streetlight issue using the API?",
                "session_id": "session_12345",
                "context_limit": 5
            }
        }
    }


class SourceInfo(BaseModel):
    """
    Model for source information in chatbot response.
    """
    title: str = Field(..., description="Title of the source document")
    url: str = Field(..., description="URL of the source document")
    relevance_score: float = Field(..., ge=0.0, le=1.0, description="Relevance score of the source")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "title": "API Documentation - Reports",
                "url": "https://urbanreflex.example.com/docs/api/reports",
                "relevance_score": 0.92
            }
        }
    }


class APILinkInfo(BaseModel):
    """
    Model for API endpoint information.
    """
    endpoints: List[str] = Field(..., description="List of API endpoints")
    source_url: str = Field(..., description="URL where the API is documented")
    title: str = Field(..., description="Title of the API documentation")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "endpoints": ["/api/v1/reports", "/api/v1/reports/{id}"],
                "source_url": "https://urbanreflex.example.com/docs/api/reports",
                "title": "Reports API Documentation"
            }
        }
    }


class ChatResponse(BaseModel):
    """
    Response model for chatbot interactions.
    """
    response: str = Field(..., description="Chatbot's response to the query")
    sources: List[SourceInfo] = Field(default_factory=list, description="List of source documents used")
    api_links: List[APILinkInfo] = Field(default_factory=list, description="Relevant API endpoints found")
    context_used: bool = Field(..., description="Whether context was used in generating the response")
    query: str = Field(..., description="Original query from the user")
    session_id: Optional[str] = Field(None, description="Session identifier for conversation tracking")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")
    processing_time: Optional[float] = Field(None, description="Time taken to process the request (seconds)")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "response": "To report a streetlight issue, you can use the POST /api/v1/reports endpoint with the required location data and issue type.",
                "sources": [
                    {
                        "title": "API Documentation - Reports",
                        "url": "https://urbanreflex.example.com/docs/api/reports",
                        "relevance_score": 0.92
                    }
                ],
                "api_links": [
                    {
                        "endpoints": ["/api/v1/reports"],
                        "source_url": "https://urbanreflex.example.com/docs/api/reports",
                        "title": "Reports API Documentation"
                    }
                ],
                "context_used": True,
                "query": "How do I report a streetlight issue using the API?",
                "session_id": "session_12345",
                "timestamp": "2025-11-28T14:10:00.000Z",
                "processing_time": 1.23
            }
        }
    }


class IndexRequest(BaseModel):
    """
    Request model for indexing website data.
    """
    base_url: Optional[str] = Field(None, description="Base URL to crawl (if not provided, uses config default)")
    max_pages: Optional[int] = Field(50, ge=1, le=200, description="Maximum number of pages to crawl")
    recreate_index: Optional[bool] = Field(False, description="Whether to recreate the vector index")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "base_url": "https://urbanreflex.example.com",
                "max_pages": 50,
                "recreate_index": False
            }
        }
    }


class IndexResponse(BaseModel):
    """
    Response model for indexing operations.
    """
    success: bool = Field(..., description="Whether the indexing operation was successful")
    message: str = Field(..., description="Status message")
    pages_crawled: Optional[int] = Field(None, description="Number of pages crawled")
    documents_indexed: Optional[int] = Field(None, description="Number of documents indexed")
    processing_time: Optional[float] = Field(None, description="Time taken for indexing (seconds)")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Operation timestamp")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "success": True,
                "message": "Successfully indexed 45 pages with 128 documents",
                "pages_crawled": 45,
                "documents_indexed": 128,
                "processing_time": 45.67,
                "timestamp": "2025-11-28T14:10:00.000Z"
            }
        }
    }


class HealthStatus(BaseModel):
    """
    Model for system health status.
    """
    gemini_api: bool = Field(..., description="Gemini API connectivity status")
    embedding_system: bool = Field(..., description="Embedding system status")
    pinecone_connection: bool = Field(..., description="Pinecone vector database status")
    overall: bool = Field(..., description="Overall system health")
    error: Optional[str] = Field(None, description="Error message if any component failed")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Health check timestamp")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "gemini_api": True,
                "embedding_system": True,
                "pinecone_connection": True,
                "overall": True,
                "timestamp": "2025-11-28T14:10:00.000Z"
            }
        }
    }


class ErrorResponse(BaseModel):
    """
    Standard error response model.
    """
    error: str = Field(..., description="Error message")
    error_type: str = Field(..., description="Type of error")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Error timestamp")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "error": "Failed to process chat request",
                "error_type": "ProcessingError",
                "details": {"query": "Invalid query format"},
                "timestamp": "2025-11-28T14:10:00.000Z"
            }
        }
    }