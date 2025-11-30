"""
Author: Trần Tuấn Anh
Created at: 2025-11-28
Updated at: 2025-11-30
Description: Embedding module for UrbanReflex RAG system.
             Uses EmbedAnything library with Pinecone vector database.
"""

import os
import asyncio
from typing import List, Dict, Optional, Any
import embed_anything
from embed_anything import EmbeddingModel, WhichModel, TextEmbedConfig
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
            
            # Delete existing index if requested
            if recreate_index:
                try:
                    self.pinecone_client.delete_index(self.index_name)
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
        if not self.pinecone_client or not self.embedding_model:
            raise RuntimeError("Embedding manager not initialized. Call initialize() first.")
        
        try:
            # Prepare data for embedding
            documents = []
            for i, text_data in enumerate(texts):
                if not text_data.get('content'):
                    continue
                    
                doc = {
                    'id': text_data.get('id', f"doc_{i}_{int(time.time())}"),
                    'text': text_data['content'],
                    'metadata': text_data.get('metadata', {})
                }
                documents.append(doc)
            
            if not documents:
                print("No valid documents to embed")
                return False
            
            # Embed documents using EmbedAnything
            print(f"Embedding {len(documents)} documents...")
            
            # Get Pinecone index
            index = self.pinecone_client.Index(self.index_name)
            
            # Embed texts in batches
            batch_size = self.embed_config.batch_size
            for i in range(0, len(documents), batch_size):
                batch = documents[i:i+batch_size]
                texts_to_embed = [doc['text'] for doc in batch]
                
                # Embed batch using correct API
                try:
                    # Try to use embed_anything.embed_text function first
                    embeddings = embed_anything.embed_text(
                        texts_to_embed,
                        embedder=self.embedding_model
                    )
                except (AttributeError, TypeError):
                    # Fallback to direct model call
                    print("Using fallback embedding method...")
                    embeddings = []
                    for text in texts_to_embed:
                        try:
                            # Try different method names
                            result = self.embedding_model(text)
                            embeddings.append({'embedding': result})
                        except Exception as e:
                            print(f"Model call failed: {e}")
                            # Try another approach
                            try:
                                result = self.embedding_model.forward([text])
                                embeddings.append({'embedding': result[0]})
                            except Exception as e2:
                                print(f"Forward call failed: {e2}")
                                # Try encode method
                                import torch
                                with torch.no_grad():
                                    result = self.embedding_model.encode(text)
                                    embeddings.append({'embedding': result})
                
                # Prepare vectors for upsert
                vectors = []
                for j, embedding_data in enumerate(embeddings):
                    doc = batch[j]
                    vectors.append({
                        'id': doc['id'],
                        'values': embedding_data['embedding'] if isinstance(embedding_data, dict) else embedding_data,
                        'metadata': {
                            'text': doc['text'],
                            **doc['metadata']
                        }
                    })
                
                # Upsert to Pinecone
                index.upsert(vectors=vectors)
            
            print(f"Successfully embedded {len(documents)} documents")
            return True
            
        except Exception as e:
            print(f"Error embedding texts: {str(e)}")
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
            try:
                # Try to use embed_anything.embed_text function first
                query_embeddings = embed_anything.embed_text(
                    [query],
                    embedder=self.embedding_model
                )
            except (AttributeError, TypeError):
                # Fallback to direct model call
                print("Using fallback query embedding method...")
                try:
                    # Try different method names
                    query_result = self.embedding_model(query)
                    query_embeddings = [{'embedding': query_result}]
                except Exception as e:
                    print(f"Model call failed: {e}")
                    # Try another approach
                    try:
                        query_result = self.embedding_model.forward([query])
                        query_embeddings = [{'embedding': query_result[0]}]
                    except Exception as e2:
                        print(f"Forward call failed: {e2}")
                        # Try encode method
                        import torch
                        with torch.no_grad():
                            query_result = self.embedding_model.encode(query)
                            query_embeddings = [{'embedding': query_result}]
            
            if not query_embeddings:
                return []
            
            # Get Pinecone index
            index = self.pinecone_client.Index(self.index_name)
            
            # Search in Pinecone
            results = index.query(
                vector=query_embeddings[0]['embedding'] if isinstance(query_embeddings[0], dict) else query_embeddings[0],
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


async def index_website_data(crawled_data: List[Dict] = None, base_url: str = None) -> bool:
    """
    Convenience function to crawl and index website data.
    
    Args:
        crawled_data: Pre-crawled data (if None, will crawl base_url)
        base_url: URL to crawl (used if crawled_data is None)
        
    Returns:
        True if successful, False otherwise
    """
    from app.ai_service.chatbot.crawler import crawl_website
    
    # Get embedding manager
    manager = await get_embedding_manager()
    
    # Get data if not provided
    if crawled_data is None:
        if not base_url:
            raise ValueError("Either crawled_data or base_url must be provided")
        crawled_data = await crawl_website(base_url)
    
    # Process and embed data
    return await manager.process_crawled_data(crawled_data)


if __name__ == "__main__":
    # Example usage
    async def main():
        try:
            # Initialize embedding manager
            manager = EmbeddingManager()
            await manager.initialize(recreate_index=True)
            
            # Example documents
            docs = [
                {
                    'id': 'doc1',
                    'content': 'UrbanReflex is a smart city management platform that helps citizens report issues.',
                    'metadata': {'source': 'documentation', 'category': 'overview'}
                },
                {
                    'id': 'doc2', 
                    'content': 'To report a streetlight issue, use the /api/v1/reports endpoint with location data.',
                    'metadata': {'source': 'api', 'category': 'endpoints'}
                }
            ]
            
            # Embed documents
            success = await manager.embed_texts(docs)
            print(f"Embedding successful: {success}")
            
            # Search for similar documents
            results = await manager.search_similar("How to report issues?")
            print(f"Search results: {results}")
            
        except Exception as e:
            print(f"Error: {str(e)}")
    
    asyncio.run(main())