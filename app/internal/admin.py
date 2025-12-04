"""
Author: Trần Tuấn Anh
Created at: 2025-11-19
Updated at: 2025-11-19
Description: Admin internal routes for UrbanReflex.
             Handles admin-only operations like user management.
"""

from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.config.config import get_database
from app.utils.auth import get_current_admin
from app.utils.db import serialize_doc

router = APIRouter()

@router.get("/users")
async def get_all_users(db: AsyncIOMotorDatabase = Depends(get_database), current_admin = Depends(get_current_admin)):
    """Get all users - Admin only"""
    users = await db.users.find().to_list(length=None)
    return [serialize_doc(user) for user in users]

@router.put("/users/{user_id}/admin")
async def set_user_admin(user_id: str, is_admin: bool, db: AsyncIOMotorDatabase = Depends(get_database), current_admin = Depends(get_current_admin)):
    """Set user admin status - Admin only"""
    from bson import ObjectId
    result = await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"is_admin": is_admin}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User admin status updated"}