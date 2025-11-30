"""
Author: Trần Tuấn Anh
Created at: 2025-11-30
Updated at: 2025-11-30
Description: Custom PineconeAdapter for EmbedAnything library
             Implements the Adapter interface for Pinecone vector database
"""

import os
from typing import List, Dict
from embed_anything.vectordb import Adapter
from embed_anything._embed_anything import EmbedData
import pinecone
from pinecone import Pinecone, ServerlessSpec


class PineconeAdapter(Adapter):
    """
    Custom Pinecone adapter for EmbedAnything library
    Implements the Adapter interface for Pinecone vector database
    """
    
    def __init__(self, api_key: str):
        """
        Initialize Pinecone adapter
        
        Args:
            api_key: Pinecone API key
        """
        super().__init__(api_key)
        self.pc = Pinecone(api_key=api_key)
        self.index_name = None
        self.index = None
    
    def create_index(self, dimension: int, metric: str = "cosine", index_name: str = "default", **kwargs):
        """
        Create a new Pinecone index
        
        Args:
            dimension: Dimension of embeddings
            metric: Distance metric (cosine, euclidean, etc.)
            index_name: Name of the index
            **kwargs: Additional arguments
        """
        self.index_name = index_name
        
        # Check if index already exists
        if index_name not in self.pc.list_indexes().names():
            # Create new index
            self.pc.create_index(
                name=index_name,
                dimension=dimension,
                metric=metric,
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
        
        # Connect to the index
        self.index = self.pc.Index(index_name)
    
    def delete_index(self, index_name: str):
        """
        Delete a Pinecone index
        
        Args:
            index_name: Name of the index to delete
        """
        try:
            self.pc.delete_index(index_name)
        except Exception as e:
            print(f"Could not delete index {index_name}: {e}")
    
    def convert(self, embeddings: List[EmbedData]) -> List[Dict]:
        """
        Convert EmbedData objects to Pinecone format
        
        Args:
            embeddings: List of EmbedData objects
            
        Returns:
            List of dictionaries in Pinecone format
        """
        vectors = []
        for i, embed_data in enumerate(embeddings):
            vector_id = f"vec_{i}_{hash(embed_data.text) % 1000000}"
            
            # Prepare metadata
            metadata = {
                'text': embed_data.text,
                **embed_data.metadata
            }
            
            vectors.append({
                'id': vector_id,
                'values': embed_data.embedding,
                'metadata': metadata
            })
        
        return vectors
    
    def upsert(self, data: List[Dict]):
        """
        Upsert data to Pinecone index
        
        Args:
            data: List of vectors to upsert
        """
        if not self.index:
            raise RuntimeError("Index not initialized. Call create_index() first.")
        
        # Convert data if needed
        if data and isinstance(data[0], EmbedData):
            data = self.convert(data)
        
        # Upsert in batches with error handling and rate limiting
        batch_size = 25  # Even smaller batch size to avoid capacity overflow
        for i in range(0, len(data), batch_size):
            batch = data[i:i+batch_size]
            try:
                self.index.upsert(vectors=batch)
                # Add small delay to avoid rate limiting
                import time
                time.sleep(0.1)  # 100ms delay between batches
            except Exception as e:
                print(f"Error upserting batch {i//batch_size}: {str(e)}")
                # Continue with next batch instead of failing completely
                continue