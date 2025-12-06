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

import time
import asyncio
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime


class ChatRequest(BaseModel):
    """Request model for chatbot interactions."""
    query: str = Field(..., min_length=1, max_length=1000, description="User's question or query")
    session_id: Optional[str] = Field(None, description="Optional session identifier for conversation tracking")
    context_limit: Optional[int] = Field(5, ge=1, le=10, description="Maximum number of context documents to retrieve")


class ChatResponse(BaseModel):
    """Response model for chatbot interactions."""
    response: str = Field(..., description="Chatbot's response to the query")
    sources: List[Dict] = Field(default_factory=list, description="List of source documents used")
    web_links: List[Dict] = Field(default_factory=list, description="Relevant web links found")
    context_used: bool = Field(..., description="Whether context was used in generating the response")
    query: str = Field(..., description="Original query from the user")
    session_id: Optional[str] = Field(None, description="Session identifier for conversation tracking")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")
    processing_time: Optional[float] = Field(None, description="Time taken to process the request (seconds)")


class IndexRequest(BaseModel):
    """Request model for indexing operations."""
    base_url: Optional[str] = Field(None, description="Base URL to crawl (if not provided, uses config default)")
    max_pages: Optional[int] = Field(50, ge=1, le=200, description="Maximum number of pages to crawl")
    recreate_index: Optional[bool] = Field(False, description="Whether to recreate the vector index")


class IndexResponse(BaseModel):
    """Response model for indexing operations."""
    success: bool = Field(..., description="Whether the indexing operation was successful")
    message: str = Field(..., description="Status message")
    pages_crawled: Optional[int] = Field(None, description="Number of pages crawled")
    documents_indexed: Optional[int] = Field(None, description="Number of documents indexed")
    processing_time: Optional[float] = Field(None, description="Time taken for indexing (seconds)")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Operation timestamp")


class ClearIndexResponse(BaseModel):
    """Response model for clear index operations."""
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="Status message")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Operation timestamp")


class RecreateIndexResponse(BaseModel):
    """Response model for recreate index operations."""
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="Status message")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Operation timestamp")


class HealthStatus(BaseModel):
    """Model for system health status."""
    gemini_api: bool = Field(..., description="Gemini API connectivity status")
    embedding_system: bool = Field(..., description="Embedding system status")
    pinecone_connection: bool = Field(..., description="Pinecone vector database status")
    overall: bool = Field(..., description="Overall system health")
    error: Optional[str] = Field(None, description="Error message if any component failed")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Health check timestamp")
from app.ai_service.chatbot.rag import get_rag_system, chat_with_rag
from app.ai_service.chatbot.embedding import get_embedding_manager, index_website_data
from app.ai_service.chatbot.pinecone_adapter import PineconeAdapter
from app.config.config import WEBSITE_CRAWL_URL, PINECONE_API_KEY, PINECONE_INDEX_NAME
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process a chat query using the RAG system.
    
    Args:
        request: Chat request containing query and optional parameters
        
    Returns:
        ChatResponse with generated answer and sources
    """
    start_time = time.time()
    
    try:
        logger.info(f"Processing chat request: {request.query[:100]}...")
        
        # Generate response using RAG system with session support
        response_data = await chat_with_rag(
            query=request.query,
            session_id=request.session_id,
            context_docs=None  # Let RAG system handle context retrieval
        )
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        # Format response
        chat_response = ChatResponse(
            response=response_data['response'],
            sources=response_data.get('sources', []),
            web_links=response_data.get('web_links', []),
            context_used=response_data.get('context_used', False),
            query=request.query,
            session_id=request.session_id,
            processing_time=processing_time
        )
        
        logger.info(f"Chat response generated in {processing_time:.2f}s")
        return chat_response
        
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process chat request: {str(e)}"
        )


@router.post("/index", response_model=IndexResponse)
async def index_website(request: IndexRequest, background_tasks: BackgroundTasks):
    """
    Index website data for the RAG system.
    
    Args:
        request: Index request with crawling parameters
        background_tasks: FastAPI background tasks for async processing
        
    Returns:
        IndexResponse with indexing status
    """
    start_time = time.time()
    
    try:
        logger.info(f"Starting website indexing for: {request.base_url or WEBSITE_CRAWL_URL}")
        
        # Initialize embedding manager if needed
        embedding_manager = await get_embedding_manager()
        
        # If recreate_index is requested, reinitialize
        if request.recreate_index:
            logger.info("Recreating vector index...")
            await embedding_manager.initialize(recreate_index=True)
        
        # Start indexing in background for large sites
        if request.max_pages > 20:
            background_tasks.add_task(
                _index_website_background,
                base_url=request.base_url or WEBSITE_CRAWL_URL,
                max_pages=request.max_pages
            )
            
            return IndexResponse(
                success=True,
                message=f"Indexing started in background for {request.max_pages} pages",
                processing_time=time.time() - start_time
            )
        
        # For smaller sites, do it synchronously
        success = await index_website_data(
            base_url=request.base_url or WEBSITE_CRAWL_URL,
            crawled_data=None
        )
        
        processing_time = time.time() - start_time
        
        if success:
            return IndexResponse(
                success=True,
                message="Website indexing completed successfully",
                pages_crawled=request.max_pages,
                processing_time=processing_time
            )
        else:
            return IndexResponse(
                success=False,
                message="Failed to index website data",
                processing_time=processing_time
            )
            
    except Exception as e:
        logger.error(f"Error during website indexing: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to index website: {str(e)}"
        )


@router.get("/health", response_model=HealthStatus)
async def health_check():
    """
    Check the health status of the chatbot system components.
    
    Returns:
        HealthStatus with component status information
    """
    try:
        # Get RAG system health
        rag_system = await get_rag_system()
        rag_health = await rag_system.health_check()
        
        # Check embedding system separately
        try:
            embedding_manager = await get_embedding_manager()
            # Test a simple search to verify Pinecone connection
            await embedding_manager.search_similar("health_check", top_k=1)
            pinecone_status = True
        except Exception as e:
            logger.warning(f"Pinecone connection check failed: {str(e)}")
            pinecone_status = False
        
        health_status = HealthStatus(
            gemini_api=rag_health.get('gemini_api', False),
            embedding_system=rag_health.get('embedding_system', False),
            pinecone_connection=pinecone_status,
            overall=rag_health.get('overall', False) and pinecone_status,
            error=rag_health.get('error')
        )
        
        return health_status
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return HealthStatus(
            gemini_api=False,
            embedding_system=False,
            pinecone_connection=False,
            overall=False,
            error=str(e)
        )


@router.post("/initialize")
async def initialize_system(recreate_index: bool = False):
    """
    Initialize the chatbot system components.
    
    Args:
        recreate_index: Whether to recreate the vector index
        
    Returns:
        Status message
    """
    try:
        logger.info("Initializing chatbot system...")
        
        # Initialize embedding manager
        embedding_manager = await get_embedding_manager()
        await embedding_manager.initialize(recreate_index=recreate_index)
        
        # Initialize RAG system
        rag_system = await get_rag_system()
        
        # Perform health check
        health = await rag_system.health_check()
        
        if health.get('overall', False):
            return {
                "success": True,
                "message": "Chatbot system initialized successfully",
                "components": {
                    "embedding_system": health.get('embedding_system', False),
                    "gemini_api": health.get('gemini_api', False)
                }
            }
        else:
            return {
                "success": False,
                "message": "Chatbot system initialization incomplete",
                "error": health.get('error', 'Unknown error'),
                "components": health
            }
            
    except Exception as e:
        logger.error(f"System initialization failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to initialize system: {str(e)}"
        )


async def _index_website_background(base_url: str, max_pages: int):
    """
    Background task for website indexing.
    
    Args:
        base_url: Base URL to crawl
        max_pages: Maximum number of pages to crawl
    """
    try:
        logger.info(f"Background indexing started for {base_url}")
        success = await index_website_data(base_url=base_url)
        
        if success:
            logger.info(f"Background indexing completed for {base_url}")
        else:
            logger.error(f"Background indexing failed for {base_url}")
            
    except Exception as e:
        logger.error(f"Background indexing error: {str(e)}")


@router.get("/stats")
async def get_system_stats():
    """
    Get system statistics and information.
    
    Returns:
        Dictionary with system statistics
    """
    try:
        # Get basic stats
        stats = {
            "system_version": "1.0.0",
            "features": {
                "rag_chat": True,
                "web_crawling": True,
                "vector_search": True,
                "gemini_integration": True
            },
            "configuration": {
                "default_crawl_url": WEBSITE_CRAWL_URL,
                "max_context_docs": 10,
                "embedding_model": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
                "llm_model": "gemini-pro"
            }
        }
        
        # Add health status
        health = await health_check()
        stats["health"] = health
        
        return stats
        
    except Exception as e:
        logger.error(f"Error getting system stats: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get system stats: {str(e)}"
        )


@router.delete("/clear-index", response_model=ClearIndexResponse)
async def clear_pinecone_index():
    """
    Clear all data from the Pinecone vector index.
    
    Returns:
        ClearIndexResponse with operation status
    """
    try:
        logger.info("Clearing Pinecone index...")
        
        # Get embedding manager to access Pinecone client
        embedding_manager = await get_embedding_manager()
        
        # Create PineconeAdapter instance
        pinecone_adapter = PineconeAdapter(
            api_key=PINECONE_API_KEY,
            index_name=PINECONE_INDEX_NAME
        )
        
        # Initialize the adapter
        await pinecone_adapter.initialize()
        
        # Clear the index
        success = await pinecone_adapter.clear_index()
        
        if success:
            logger.info("Pinecone index cleared successfully")
            return ClearIndexResponse(
                success=True,
                message="Pinecone vector index cleared successfully"
            )
        else:
            logger.error("Failed to clear Pinecone index")
            return ClearIndexResponse(
                success=False,
                message="Failed to clear Pinecone vector index"
            )
            
    except Exception as e:
        logger.error(f"Error clearing Pinecone index: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to clear Pinecone index: {str(e)}"
        )


@router.post("/recreate-index", response_model=RecreateIndexResponse)
async def recreate_pinecone_index():
    """
    Recreate the Pinecone vector index (delete and create fresh).
    
    Returns:
        RecreateIndexResponse with operation status
    """
    try:
        logger.info("Recreating Pinecone index...")
        
        # Get embedding manager to access Pinecone client
        embedding_manager = await get_embedding_manager()
        
        # Create PineconeAdapter instance
        pinecone_adapter = PineconeAdapter(
            api_key=PINECONE_API_KEY,
            index_name=PINECONE_INDEX_NAME
        )
        
        # Initialize the adapter
        await pinecone_adapter.initialize()
        
        # Recreate the index
        success = await pinecone_adapter.recreate_index()
        
        if success:
            logger.info("Pinecone index recreated successfully")
            return RecreateIndexResponse(
                success=True,
                message="Pinecone vector index recreated successfully"
            )
        else:
            logger.error("Failed to recreate Pinecone index")
            return RecreateIndexResponse(
                success=False,
                message="Failed to recreate Pinecone vector index"
            )
            
    except Exception as e:
        logger.error(f"Error recreating Pinecone index: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to recreate Pinecone index: {str(e)}"
        )