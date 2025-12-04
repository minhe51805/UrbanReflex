"""
Author: Trần Tuấn Anh
Created at: 2025-11-19
Updated at: 2025-11-19
Description: Authentication router for UrbanReflex.
             Handles user registration, login, and profile retrieval.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.config.config import get_database
from app.schemas.user import UserCreate, User, Token, LoginRequest
from app.utils.auth import get_password_hash, verify_password, create_access_token, get_current_user
from app.utils.db import serialize_doc

router = APIRouter()

@router.post("/register", response_model=User)
async def register(user: UserCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    # Check if user already exists
    existing_user = await db.users.find_one({"$or": [{"email": user.email}, {"username": user.username}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    
    # Hash password
    hashed_password = get_password_hash(user.password)
    
    # Create user document
    user_doc = {
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
        "phone": user.phone,
        "latitude": user.latitude,
        "longitude": user.longitude,
        "is_admin": False,  # Always set to False for security
        "hashed_password": hashed_password
    }
    
    # Insert into database
    result = await db.users.insert_one(user_doc)
    # Convert ObjectId to string and sanitize before returning
    user_doc["_id"] = str(result.inserted_id)
    return serialize_doc(user_doc)

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: AsyncIOMotorDatabase = Depends(get_database)):
    user = await db.users.find_one({"$or": [{"email": login_data.identifier}, {"username": login_data.identifier}]})
    if not user or not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user = Depends(get_current_user)):
    return current_user