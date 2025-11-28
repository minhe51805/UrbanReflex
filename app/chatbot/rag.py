"""
Author: Trần Tuấn Anh
Created at: 2025-11-28
Updated at: 2025-11-28
Description: RAG (Retrieval-Augmented Generation) module for UrbanReflex chatbot.
             Integrates with Gemini API for intelligent responses based on retrieved context.
"""

import os
import asyncio
from typing import List, Dict, Optional, Any
import google.generativeai as genai
from app.config.config import GEMINI_API_KEY
from app.chatbot.embedding import get_embedding_manager


class RAGSystem:
    """
    Retrieval-Augmented Generation system for chatbot responses.
    Combines vector search with Gemini API for context-aware answers.
    """
    
    def __init__(self, api_key: str = None):
        """
        Initialize RAG system with Gemini API.
        
        Args:
            api_key: Gemini API key (defaults to environment variable)
        """
        self.api_key = api_key or GEMINI_API_KEY
        
        if not self.api_key:
            raise ValueError("Gemini API key is required")
        
        # Configure Gemini
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        
        # System prompt for UrbanReflex help assistant
        self.system_prompt = """
        You are a helpful assistant for the UrbanReflex smart city management platform.
        Your role is to help users understand how to use the platform, answer questions about features,
        and provide guidance on API usage when applicable.
        
        Guidelines:
        1. Always base your answers on the provided context
        2. If the context doesn't contain relevant information, say so clearly
        3. When mentioning API endpoints, provide the full URL format
        4. Be concise but thorough in your explanations
        5. If you're unsure about something, ask for clarification
        6. Always maintain a professional and helpful tone
        
        When responding about API usage, include:
        - The endpoint URL
        - HTTP method (GET, POST, etc.)
        - Required parameters
        - Example request/response if helpful
        """
    
    async def generate_response(self, query: str, context_docs: List[Dict] = None) -> Dict[str, Any]:
        """
        Generate a response using RAG approach.
        
        Args:
            query: User's question
            context_docs: Retrieved context documents (if None, will search)
            
        Returns:
            Dictionary containing response and metadata
        """
        try:
            # Get context if not provided
            if context_docs is None:
                embedding_manager = await get_embedding_manager()
                context_docs = await embedding_manager.search_similar(query, top_k=5)
            
            # Format context for prompt
            context_text = self._format_context(context_docs)
            
            # Create prompt with context
            full_prompt = f"""
            {self.system_prompt}
            
            Context from UrbanReflex documentation:
            {context_text}
            
            User Question: {query}
            
            Please provide a helpful response based on the context above.
            """
            
            # Generate response with Gemini
            response = self.model.generate_content(full_prompt)
            
            # Extract response text
            response_text = response.text
            
            # Extract relevant API links from context
            api_links = self._extract_api_links(context_docs)
            
            return {
                'response': response_text,
                'sources': self._format_sources(context_docs),
                'api_links': api_links,
                'context_used': len(context_docs) > 0,
                'query': query
            }
            
        except Exception as e:
            return {
                'response': f"I apologize, but I encountered an error while processing your question: {str(e)}",
                'sources': [],
                'api_links': [],
                'context_used': False,
                'query': query,
                'error': str(e)
            }
    
    def _format_context(self, context_docs: List[Dict]) -> str:
        """
        Format context documents for the prompt.
        
        Args:
            context_docs: List of context documents
            
        Returns:
            Formatted context string
        """
        if not context_docs:
            return "No relevant documentation found."
        
        formatted_context = []
        for i, doc in enumerate(context_docs, 1):
            title = doc.get('metadata', {}).get('title', 'Untitled')
            url = doc.get('metadata', {}).get('url', '')
            text = doc.get('text', '')
            score = doc.get('score', 0)
            
            context_entry = f"""
            Document {i} (Relevance: {score:.2f}):
            Title: {title}
            URL: {url}
            Content: {text[:1000]}{'...' if len(text) > 1000 else ''}
            """
            formatted_context.append(context_entry)
        
        return '\n'.join(formatted_context)
    
    def _format_sources(self, context_docs: List[Dict]) -> List[Dict]:
        """
        Format source information for response.
        
        Args:
            context_docs: List of context documents
            
        Returns:
            List of formatted source information
        """
        sources = []
        for doc in context_docs:
            metadata = doc.get('metadata', {})
            sources.append({
                'title': metadata.get('title', 'Untitled'),
                'url': metadata.get('url', ''),
                'relevance_score': doc.get('score', 0)
            })
        return sources
    
    def _extract_api_links(self, context_docs: List[Dict]) -> List[Dict]:
        """
        Extract API endpoint information from context.
        
        Args:
            context_docs: List of context documents
            
        Returns:
            List of API endpoint information
        """
        api_links = []
        api_keywords = ['endpoint', 'api', '/api/', 'http', 'request', 'response']
        
        for doc in context_docs:
            text = doc.get('text', '').lower()
            metadata = doc.get('metadata', {})
            
            # Simple heuristic to detect API-related content
            if any(keyword in text for keyword in api_keywords):
                # Extract potential API endpoints (basic pattern matching)
                import re
                endpoint_pattern = r'/api/[^\s\)]+'
                endpoints = re.findall(endpoint_pattern, text)
                
                if endpoints:
                    base_url = metadata.get('url', '')
                    api_links.append({
                        'endpoints': list(set(endpoints)),  # Remove duplicates
                        'source_url': base_url,
                        'title': metadata.get('title', 'API Documentation')
                    })
        
        return api_links
    
    async def health_check(self) -> Dict[str, Any]:
        """
        Check the health of the RAG system components.
        
        Returns:
            Health status information
        """
        status = {
            'gemini_api': False,
            'embedding_system': False,
            'overall': False
        }
        
        try:
            # Test Gemini API
            test_response = self.model.generate_content("Hello")
            if test_response.text:
                status['gemini_api'] = True
            
            # Test embedding system
            embedding_manager = await get_embedding_manager()
            test_results = await embedding_manager.search_similar("test", top_k=1)
            status['embedding_system'] = True
            
            # Overall status
            status['overall'] = status['gemini_api'] and status['embedding_system']
            
        except Exception as e:
            status['error'] = str(e)
        
        return status


# Global RAG system instance
_rag_system = None


async def get_rag_system() -> RAGSystem:
    """
    Get or create global RAG system instance.
    
    Returns:
        RAGSystem instance
    """
    global _rag_system
    
    if _rag_system is None:
        _rag_system = RAGSystem()
    
    return _rag_system


async def chat_with_rag(query: str, context_docs: List[Dict] = None) -> Dict[str, Any]:
    """
    Convenience function for chat interaction with RAG.
    
    Args:
        query: User's question
        context_docs: Optional context documents
        
    Returns:
        Response dictionary
    """
    rag_system = await get_rag_system()
    return await rag_system.generate_response(query, context_docs)


if __name__ == "__main__":
    # Example usage
    async def main():
        try:
            # Initialize RAG system
            rag = RAGSystem()
            
            # Example query
            query = "How do I report a streetlight issue using the API?"
            
            # Generate response
            response = await rag.generate_response(query)
            
            print("Response:", response['response'])
            print("Sources:", response['sources'])
            print("API Links:", response['api_links'])
            
            # Health check
            health = await rag.health_check()
            print("Health Status:", health)
            
        except Exception as e:
            print(f"Error: {str(e)}")
    
    asyncio.run(main())