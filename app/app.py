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

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import items, users, auth, chatbot, citizen_reports
from app.internal import admin

app = FastAPI(title="UrbanReflex Backend", version="1.0.0")

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(items.router, prefix="/api/v1", tags=["items"])
app.include_router(users.router, prefix="/api/v1", tags=["users"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(chatbot.router, prefix="/ai-service/chatbot", tags=["chatbot"])
app.include_router(citizen_reports.router)

@app.get("/")
async def root():
    return {"message": "Welcome to UrbanReflex Backend API"}


@app.get("/health")
async def health_check():
    """Health endpoint for monitoring/CI.

    Returns a simple JSON to make sure the running process is this app.
    """
    return {"service": "UrbanReflex", "status": "running", "version": "1.0.0"}


@app.on_event("startup")
async def startup_event():
    print("UrbanReflex app startup — version=1.0.0")