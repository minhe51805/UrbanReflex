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