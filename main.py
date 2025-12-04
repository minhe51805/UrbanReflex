"""
Author: Trần Tuấn Anh
Created at: 2025-11-19
Updated at: 2025-11-19
Description: Entry point for the UrbanReflex FastAPI application.
             Starts the Uvicorn server with auto-reload for development.
"""

from app.app import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.app:app", host="0.0.0.0", port=8000, reload=True)
