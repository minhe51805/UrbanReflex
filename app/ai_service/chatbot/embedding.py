"""
Author: Trần Tuấn Anh
Created at: 2025-11-28
Updated at: 2025-11-30
Description: Embedding module for UrbanReflex RAG system.
             Uses EmbedAnything library with Pinecone vector database.
"""

import os
import asyncio
import tempfile
from typing import List, Dict, Optional, Any
import embed_anything
from embed_anything import EmbeddingModel, WhichModel, TextEmbedConfig
from app.ai_service.chatbot.pinecone_adapter import PineconeAdapter
from pinecone import Pinecone, ServerlessSpec
from app.config.config import PINECONE_API_KEY, PINECONE_INDEX_NAME
import time


class EmbeddingManager:
    """
    Manages text embeddings and vector database operations for RAG system.
    Uses EmbedAnything library with Pinecone as vector store.
    """
    
    def __init__(self, api_key: str = None, index_name: str = None):
        """
        Initialize embedding manager with Pinecone configuration.
        
        Args:
            api_key: Pinecone API key (defaults to environment variable)
            index_name: Pinecone index name (defaults to config value)
        """
        self.api_key = api_key or PINECONE_API_KEY
        self.index_name = index_name or PINECONE_INDEX_NAME
        
        if not self.api_key:
            raise ValueError("Pinecone API key is required")
        
        self.pinecone_client = None
        self.embedding_model = None
        self.pinecone_adapter = None
        self.embed_config = TextEmbedConfig(chunk_size=512, batch_size=32)
        
    async def initialize(self, recreate_index: bool = False):
        """
        Initialize Pinecone connection and embedding model.
        
        Args:
            recreate_index: Whether to recreate index if it exists
        """
        try:
            # Initialize Pinecone client
            self.pinecone_client = Pinecone(api_key=self.api_key)
            
            # Initialize PineconeAdapter for EmbedAnything
            self.pinecone_adapter = PineconeAdapter(api_key=self.api_key)
            
            # Delete existing index if requested
            if recreate_index:
                try:
                    self.pinecone_adapter.delete_index(self.index_name)
                    print(f"Deleted existing index: {self.index_name}")
                except Exception as e:
                    print(f"Could not delete index (may not exist): {e}")
            
            # Create new index with appropriate dimensions
            # Using CLIP model with 512 dimensions
            if self.index_name not in self.pinecone_client.list_indexes().names():
                self.pinecone_client.create_index(
                    name=self.index_name,
                    dimension=512,
                    metric="cosine",
                    spec=ServerlessSpec(cloud="aws", region="us-east-1")
                )
                print(f"Created index: {self.index_name}")
            else:
                print(f"Index {self.index_name} already exists")
            
            # Initialize CLIP embedding model
            self.embedding_model = EmbeddingModel.from_pretrained_hf(
                WhichModel.Clip, 
                "openai/clip-vit-base-patch16", 
                revision="main"
            )
            print("Initialized CLIP embedding model")
            
        except Exception as e:
            raise RuntimeError(f"Failed to initialize embedding manager: {str(e)}")
    
    async def embed_texts(self, texts: List[Dict[str, Any]]) -> bool:
        """
        Embed text documents and store in Pinecone.
        
        Args:
            texts: List of dictionaries with 'content' and optional 'metadata'
            
        Returns:
            True if successful, False otherwise
        """
        if not self.pinecone_adapter or not self.embedding_model:
            raise RuntimeError("Embedding manager not initialized. Call initialize() first.")
        
        try:
            # Create temporary files for embedding with EmbedAnything
            with tempfile.TemporaryDirectory() as temp_dir:
                file_paths = []
                
                # Create temporary text files
                for i, text_data in enumerate(texts):
                    if not text_data.get('content'):
                        continue
                        
                    file_path = os.path.join(temp_dir, f"doc_{i}.txt")
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(text_data['content'])
                    file_paths.append(file_path)
                
                if not file_paths:
                    print("No valid documents to embed")
                    return False
                
                print(f"Embedding {len(file_paths)} documents...")
                
                # Embed files with Pinecone adapter using EmbedAnything
                embed_data_list = embed_anything.embed_files_batch(
                    files=file_paths,
                    embedder=self.embedding_model,
                    config=self.embed_config,
                    adapter=self.pinecone_adapter
                )
                
                print(f"Successfully embedded {len(embed_data_list)} documents")
                return True
            
        except Exception as e:
            print(f"Error embedding texts: {str(e)}")
            return False
    
    async def embed_webpage(self, url: str) -> bool:
        """
        Embed and store a webpage directly using EmbedAnything.
        
        Args:
            url: URL of the webpage to embed
            
        Returns:
            True if successful, False otherwise
        """
        if not self.pinecone_adapter or not self.embedding_model:
            raise RuntimeError("Embedding manager not initialized. Call initialize() first.")
        
        try:
            print(f"Embedding webpage: {url}")
            
            # Embed webpage directly with Pinecone adapter
            embed_data_list = embed_anything.embed_webpage(
                url=url,
                embedder=self.embedding_model,
                config=self.embed_config,
                adapter=self.pinecone_adapter
            )
            
            print(f"Successfully embedded webpage {url} with {len(embed_data_list)} chunks")
            return True
            
        except Exception as e:
            print(f"Error embedding webpage: {str(e)}")
            return False
    
    async def search_similar(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        Search for similar documents based on query.
        
        Args:
            query: Search query text
            top_k: Number of top results to return
            
        Returns:
            List of similar documents with metadata
        """
        if not self.pinecone_client or not self.embedding_model:
            raise RuntimeError("Embedding manager not initialized. Call initialize() first.")
        
        try:
            # Embed query using correct API
            query_embeddings = embed_anything.embed_query(
                [query],
                embedder=self.embedding_model
            )
            
            if not query_embeddings:
                return []
            
            # Get Pinecone index
            index = self.pinecone_client.Index(self.index_name)
            
            # Search in Pinecone
            results = index.query(
                vector=query_embeddings[0].embedding,
                top_k=top_k,
                include_metadata=True
            )
            
            # Format results
            formatted_results = []
            for match in results.get('matches', []):
                formatted_results.append({
                    'id': match.get('id'),
                    'score': match.get('score'),
                    'text': match.get('metadata', {}).get('text', ''),
                    'metadata': match.get('metadata', {})
                })
            
            return formatted_results
            
        except Exception as e:
            print(f"Error searching similar documents: {str(e)}")
            return []
    
    async def process_crawled_data(self, crawled_data: List[Dict]) -> bool:
        """
        Process crawled web data and embed it.
        
        Args:
            crawled_data: List of crawled page data from crawler
            
        Returns:
            True if successful, False otherwise
        """
        if not crawled_data:
            print("No crawled data to process")
            return False
        
        # Convert crawled data to embedding format
        documents = []
        for page_data in crawled_data:
            if not page_data.get('content'):
                continue
            
            # Create metadata with URL, title, and description
            metadata = {
                'url': page_data.get('url', ''),
                'title': page_data.get('title', ''),
                'description': page_data.get('description', ''),
                'crawled_at': page_data.get('crawled_at', time.time()),
                'source': 'web_crawl'
            }
            
            # Split content into chunks if too long
            content = page_data['content']
            if len(content) > 1000:
                # Split into chunks of approximately 1000 characters
                chunks = [content[i:i+1000] for i in range(0, len(content), 1000)]
                for i, chunk in enumerate(chunks):
                    chunk_metadata = metadata.copy()
                    chunk_metadata['chunk_index'] = i
                    chunk_metadata['total_chunks'] = len(chunks)
                    
                    documents.append({
                        'id': f"{page_data.get('url', 'unknown')}_{i}",
                        'content': chunk,
                        'metadata': chunk_metadata
                    })
            else:
                documents.append({
                    'id': page_data.get('url', 'unknown'),
                    'content': content,
                    'metadata': metadata
                })
        
        # Embed documents
        return await self.embed_texts(documents)
    
    async def get_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the embedding service.
        
        Returns:
            Dictionary with service statistics
        """
        stats = {
            "model_initialized": self.embedding_model is not None,
            "pinecone_connected": self.pinecone_client is not None,
            "pinecone_adapter_initialized": self.pinecone_adapter is not None,
            "index_name": self.index_name
        }
        
        # Get index stats if available
        if self.pinecone_client:
            try:
                index = self.pinecone_client.Index(self.index_name)
                index_stats = index.describe_index_stats()
                stats["vector_count"] = index_stats.total_vector_count
                stats["index_size"] = index_stats.index_size
            except Exception as e:
                print(f"Failed to get index stats: {str(e)}")
                stats["vector_count"] = "unknown"
                stats["index_size"] = "unknown"
        
        return stats


# Global embedding manager instance
_embedding_manager = None


async def get_embedding_manager() -> EmbeddingManager:
    """
    Get or create global embedding manager instance.
    
    Returns:
        EmbeddingManager instance
    """
    global _embedding_manager
    
    if _embedding_manager is None:
        _embedding_manager = EmbeddingManager()
        await _embedding_manager.initialize()
    
    return _embedding_manager


async def index_website_data(base_url: str, crawled_data: List[Dict] = None) -> bool:
    """
    Index website data for RAG system.
    
    Args:
        base_url: Base URL to crawl (if crawled_data is None)
        crawled_data: Pre-crawled data (if provided, skips crawling)
        
    Returns:
        True if successful, False otherwise
    """
    try:
        from app.ai_service.chatbot.crawler import WebCrawler
        
        # Get embedding manager
        embedding_manager = await get_embedding_manager()
        
        # If no crawled data provided, crawl the website
        if crawled_data is None:
            logger.info(f"Crawling website: {base_url}")
            crawler = WebCrawler(base_url=base_url)
            crawled_data = await crawler.crawl_website(max_pages=50)
            
            if not crawled_data:
                logger.error("No data crawled from website")
                return False
        
        # Process crawled data and embed it
        logger.info(f"Processing {len(crawled_data)} crawled pages...")
        success = await embedding_manager.process_crawled_data(crawled_data)
        
        if success:
            logger.info(f"Successfully indexed {len(crawled_data)} pages from {base_url}")
        else:
            logger.error(f"Failed to index data from {base_url}")
        
        return success
        
    except Exception as e:
        logger.error(f"Error indexing website data: {str(e)}")
        return False