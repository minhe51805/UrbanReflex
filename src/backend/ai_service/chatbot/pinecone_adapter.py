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
    
    def __init__(self, api_key: str, index_name: str = "default"):
        """
        Initialize Pinecone adapter
        
        Args:
            api_key: Pinecone API key
            index_name: Name of the index to use
        """
        super().__init__(api_key)
        self.pc = Pinecone(api_key=api_key)
        self.index_name = index_name
        self.index = None
    
    async def initialize(self):
        """
        Initialize the adapter by connecting to existing index
        """
        try:
            # Check if index exists
            if self.index_name in self.pc.list_indexes().names():
                self.index = self.pc.Index(self.index_name)
                print(f"Connected to existing index: {self.index_name}")
            else:
                print(f"Index {self.index_name} does not exist yet")
        except Exception as e:
            print(f"Error initializing Pinecone adapter: {str(e)}")
    
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
        batch_size = 10  # Very small batch size to avoid capacity overflow
        for i in range(0, len(data), batch_size):
            batch = data[i:i+batch_size]
            try:
                self.index.upsert(vectors=batch)
                # Add longer delay to avoid rate limiting
                import time
                time.sleep(0.5)  # 500ms delay between batches
            except Exception as e:
                print(f"Error upserting batch {i//batch_size}: {str(e)}")
                # Continue with next batch instead of failing completely
                continue
    
    async def clear_index(self, index_name: str = None) -> bool:
        """
        Clear all data from Pinecone index.
        
        Args:
            index_name: Name of index to clear (defaults to instance index)
            
        Returns:
            True if successful, False otherwise
        """
        index_name = index_name or self.index_name
        try:
            self.pc.delete_index(index_name)
            print(f"Successfully deleted index: {index_name}")
            return True
        except Exception as e:
            print(f"Error deleting index {index_name}: {str(e)}")
            return False
    
    async def recreate_index(self, dimension: int = 384, metric: str = "cosine") -> bool:
        """
        Recreate Pinecone index with fresh configuration.
        
        Args:
            dimension: Embedding dimension
            metric: Distance metric (cosine, euclidean, etc.)
            
        Returns:
            True if successful, False otherwise
        """
        index_name = self.index_name
        try:
            # Delete existing index
            await self.clear_index(index_name)
            
            # Create new index
            self.create_index(dimension, metric, index_name)
            
            print(f"Successfully recreated index: {index_name}")
            return True
        except Exception as e:
            print(f"Error recreating index {index_name}: {str(e)}")
            return False