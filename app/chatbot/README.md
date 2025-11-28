# Chatbot Service

RAG-based intelligent assistant service for UrbanReflex platform documentation and API guidance.

## Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Configure required variables
GEMINI_API_KEY=your-gemini-key
PINECONE_API_KEY=your-pinecone-key
WEBSITE_CRAWL_URL=https://your-website.com
```

### 2. Initialize Service

```bash
curl -X POST "http://localhost:8000/chatbot/initialize"
```

### 3. Index Documentation

```bash
curl -X POST "http://localhost:8000/chatbot/index" \
  -H "Content-Type: application/json" \
  -d '{"max_pages": 50}'
```

### 4. Use Chatbot

```bash
curl -X POST "http://localhost:8000/chatbot/chat" \
  -H "Content-Type: application/json" \
  -d '{"query": "How to report streetlight issues?"}'
```

## API Endpoints

| Method | Endpoint              | Description                 |
| ------ | --------------------- | --------------------------- |
| POST   | `/chatbot/initialize` | Initialize chatbot system   |
| POST   | `/chatbot/index`      | Index website documentation |
| POST   | `/chatbot/chat`       | Chat with AI assistant      |
| GET    | `/chatbot/health`     | Check system health         |
| GET    | `/chatbot/stats`      | Get system statistics       |

## Features

- **Smart Responses**: Context-aware answers using RAG architecture
- **API Discovery**: Automatically provides relevant API endpoints
- **Web Crawling**: Automated documentation indexing
- **Vector Search**: Fast semantic similarity matching
- **Health Monitoring**: Real-time system status tracking

## Architecture

```
User Query → Vector Search → Context Retrieval → Gemini AI → Response + API Links
     ↑              ↑              ↑                ↑
   Router      Pinecone       Web Crawler    EmbedAnything
```

## Dependencies

- **EmbedAnything**: Text embedding with CLIP model
- **Pinecone**: Vector database for similarity search
- **Gemini AI**: Large language model for responses
- **FastAPI**: REST API framework

## Configuration

Key environment variables:

- `GEMINI_API_KEY`: Gemini API authentication
- `PINECONE_API_KEY`: Pinecone vector database access
- `WEBSITE_CRAWL_URL`: Documentation source URL
- `PINECONE_INDEX_NAME`: Vector database index name

## Troubleshooting

1. **API Key Issues**: Verify keys in environment variables
2. **Indexing Fails**: Check website accessibility and robots.txt
3. **Slow Responses**: Monitor Pinecone quota and Gemini limits
4. **Memory Issues**: Reduce batch size and max pages

## Health Check

```bash
curl -X GET "http://localhost:8000/chatbot/health"
```

Expected response:

```json
{
  "gemini_api": true,
  "embedding_system": true,
  "pinecone_connection": true,
  "overall": true
}
```
