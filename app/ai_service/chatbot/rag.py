"""
Author: Trần Tuấn Anh
Created at: 2025-11-28
Updated at: 2025-11-30
Description: RAG (Retrieval-Augmented Generation) module for UrbanReflex chatbot.
             Integrates with Gemini API for intelligent responses based on retrieved context.
             Optimized for user support with detailed guidance and web links.
"""

import os
import asyncio
from typing import List, Dict, Optional, Any
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv
from app.ai_service.chatbot.embedding import get_embedding_manager
from app.models.chat_history import ChatSession, ChatMessage
from app.config.config import get_database

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


class RAGSystem:
    """
    Retrieval-Augmented Generation system for chatbot responses.
    Combines vector search with Gemini API for context-aware answers.
    Optimized for UrbanReflex user support with detailed guidance.
    """
    
    def __init__(self, api_key: str = None):
        """
        Initialize RAG system with Gemini API.
        
        Args:
            api_key: Gemini API key (defaults to environment variable)
        """
        self.api_key = GEMINI_API_KEY
        
        if not self.api_key:
            raise ValueError("Gemini API key is required")
        
        # Configure Gemini
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        
        # System prompt for UrbanReflex help assistant
        self.system_prompt = """
        You are a professional support assistant for the UrbanReflex smart city platform.
        Your role is to help users understand how to use the platform, answer questions about features,
        and provide detailed guidance on reporting issues and using services.
        
        GUIDELINES:
        1. Always base your answers on provided context
        2. If no relevant information is available, state clearly and suggest alternatives
        3. When providing steps, present them in clear sequential order
        4. Always include relevant web links when available
        5. Use friendly, professional, and easy-to-understand language
        6. When mentioning APIs, provide complete information
        
        WHEN ANSWERING ABOUT HOW TO REPORT ISSUES:
        - Provide detailed step-by-step instructions
        - Include direct links to reporting pages
        - Explain required information
        - Suggest alternative options if available
        
        WHEN ANSWERING ABOUT THE PROJECT:
        - Explain UrbanReflex's goals and vision
        - Highlight key features
        - Provide links to introduction pages
        
        ALWAYS INCLUDE:
        - Relevant web links for the answer
        - Detailed implementation steps
        - Contact information if additional support is needed
        """
    
    async def generate_response(self, query: str, session_id: str = None, user_id: str = None, context_docs: List[Dict] = None) -> Dict[str, Any]:
        """
        Generate a response using RAG approach with chat history.
        
        Args:
            query: User's question
            session_id: Session identifier for context
            user_id: User identifier for personalization
            context_docs: Retrieved context documents (if None, will search)
            
        Returns:
            Dictionary containing response and metadata
        """
        try:
            # Get chat history if session_id provided
            chat_history = ""
            if session_id:
                chat_history = await self._get_chat_history(session_id)
            
            # Get context if not provided
            if context_docs is None:
                embedding_manager = await get_embedding_manager()
                context_docs = await embedding_manager.search_similar(query, top_k=5)
            
            # Format context for prompt
            context_text = self._format_context(context_docs)
            
            # Create prompt with context and history
            full_prompt = f"""
            {self.system_prompt}
            
            CHAT HISTORY FOR CONTEXT:
            {chat_history}
            
            CONTEXT FROM URBANREFLEX DOCUMENTATION:
            {context_text}
            
            USER QUESTION: {query}
            
            PLEASE PROVIDE A HELPFUL RESPONSE BASED ON THE CONTEXT ABOVE.
            
            IMPORTANT:
            - Always respond in the user's language (Vietnamese for Vietnamese questions)
            - Provide detailed step-by-step guidance
            - Include relevant web links
            - If multiple steps, number them sequentially
            - Add important notes if applicable
            - Consider previous conversation context for continuity
            """
            
            # Generate response with Gemini
            response = self.model.generate_content(full_prompt)
            
            # Extract response text
            response_text = response.text
            
            # Extract relevant links from context
            web_links = self._extract_web_links(context_docs)
            
            # Save chat messages if session_id provided
            if session_id:
                await self._save_chat_message(session_id, user_id, query, response_text)
            
            return {
                'response': response_text,
                'sources': self._format_sources(context_docs),
                'web_links': web_links,
                'context_used': len(context_docs) > 0,
                'query': query,
                'session_id': session_id
            }
            
        except Exception as e:
            return {
                'response': f"Xin lỗi, tôi đã gặp lỗi khi xử lý câu hỏi của bạn: {str(e)}",
                'sources': [],
                'web_links': [],
                'context_used': False,
                'query': query,
                'error': str(e)
            }
    
    def _format_context(self, context_docs: List[Dict]) -> str:
        """
        Format context documents for prompt.
        
        Args:
            context_docs: List of context documents
            
        Returns:
            Formatted context string
        """
        if not context_docs:
            return "No relevant documentation found."
        
        formatted_context = []
        for i, doc in enumerate(context_docs, 1):
            title = doc.get('metadata', {}).get('title', 'Không có tiêu đề')
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
    
    def _extract_web_links(self, context_docs: List[Dict]) -> List[Dict]:
        """
        Extract web links and relevant information from context.
        
        Args:
            context_docs: List of context documents
            
        Returns:
            List of web link information
        """
        links = []
        
        for doc in context_docs:
            text = doc.get('text', '')
            metadata = doc.get('metadata', {})
            
            # Extract URLs from text
            import re
            url_pattern = r'https?://[^\s<>"\'\)]+'
            urls = re.findall(url_pattern, text)
            
            # Add the main source URL
            source_url = metadata.get('url', '')
            if source_url and source_url not in urls:
                urls.append(source_url)
            
            if urls:
                links.append({
                    'urls': list(set(urls)),  # Remove duplicates
                    'source_title': metadata.get('title', 'Tài liệu'),
                    'description': self._extract_link_description(text)
                })
        
        return links
    
    def _extract_link_description(self, text: str) -> str:
        """
        Extract a brief description of what the link is about.
        
        Args:
            text: Text containing the link
            
        Returns:
            Brief description
        """
        # Simple heuristic to extract description
        sentences = text.split('.')
        for sentence in sentences[:2]:  # Check first 2 sentences
            if any(keyword in sentence.lower() for keyword in ['báo cáo', 'hướng dẫn', 'trang', 'dịch vụ', 'tính năng']):
                return sentence.strip()
        
        return "Thông tin liên quan"
    
    async def health_check(self) -> Dict[str, Any]:
        """
        Check health of RAG system components.
        
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
            test_response = self.model.generate_content("Xin chào")
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
    
    async def _get_chat_history(self, session_id: str, limit: int = 10) -> str:
        """
        Get chat history for context.
        
        Args:
            session_id: Session identifier
            limit: Maximum number of messages to retrieve
            
        Returns:
            Formatted chat history string
        """
        try:
            from app.models.chat_history import ChatSession
            db = await get_database()
            session = await db.chat_sessions.find_one({"session_id": session_id})
            
            if not session or not session.get('messages'):
                return ""
            
            # Get recent messages
            messages = session['messages'][-limit:]
            
            # Format history
            history_lines = []
            for msg in messages:
                role = "User" if msg['role'] == 'user' else "Assistant"
                history_lines.append(f"{role}: {msg['content']}")
            
            return "\n".join(history_lines[-6:])  # Last 6 messages for context
            
        except Exception as e:
            print(f"Error getting chat history: {str(e)}")
            return ""
    
    async def _save_chat_message(self, session_id: str, user_id: str, user_message: str, assistant_message: str):
        """
        Save chat messages to database.
        
        Args:
            session_id: Session identifier
            user_id: User identifier
            user_message: User's message
            assistant_message: Assistant's response
        """
        try:
            db = await get_database()
            
            # Create or update session
            now = datetime.utcnow()
            
            # Add user message
            user_msg = ChatMessage(
                role="user",
                content=user_message,
                timestamp=now
            )
            
            # Add assistant message
            assistant_msg = ChatMessage(
                role="assistant",
                content=assistant_message,
                timestamp=now
            )
            
            # Update session
            await db.chat_sessions.update_one(
                {"session_id": session_id},
                {
                    "$set": {
                        "user_id": user_id,
                        "updated_at": now,
                        "$push": {
                            "messages": {
                                "$each": [user_msg.model_dump(), assistant_msg.model_dump()]
                            }
                        }
                    }
                },
                upsert=True
            )
            
        except Exception as e:
            print(f"Error saving chat message: {str(e)}")


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
            
            # Example queries
            queries = [
                "I don't know how to report issues",
                "What is this project about?",
                "How to report broken streetlights?"
            ]
            
            for query in queries:
                print(f"\nQuestion: {query}")
                response = await rag.generate_response(query)
                print("Response:", response['response'])
                print("Sources:", response['sources'])
                print("Links:", response['web_links'])
                print("-" * 50)
            
            # Health check
            health = await rag.health_check()
            print("System Health Status:", health)
            
        except Exception as e:
            print(f"Lỗi: {str(e)}")
    
    asyncio.run(main())