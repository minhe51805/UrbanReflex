"""
Author: Trần Tuấn Anh
Created at: 2025-11-28
Updated at: 2025-11-28
Description: Chatbot router for UrbanReflex RAG system.
             Provides endpoints for chat interaction, indexing, and health checks.
"""

import time
import asyncio
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from app.schemas.chatbot import (
    ChatRequest, ChatResponse, IndexRequest, IndexResponse, 
    HealthStatus, ErrorResponse
)
from app.chatbot.rag import get_rag_system, chat_with_rag
from app.chatbot.embedding import get_embedding_manager, index_website_data
from app.config.config import WEBSITE_CRAWL_URL
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
        
        # Generate response using RAG system
        response_data = await chat_with_rag(
            query=request.query,
            context_docs=None  # Let RAG system handle context retrieval
        )
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        # Format response
        chat_response = ChatResponse(
            response=response_data['response'],
            sources=response_data.get('sources', []),
            api_links=response_data.get('api_links', []),
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
                "embedding_model": "openai/clip-vit-base-patch16",
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