"""
Author: Trần Tuấn Anh
Created at: 2025-11-19
Updated at: 2025-11-19
Description: Pydantic models for user data validation and API responses.
             Includes User, UserCreate, Token, and LoginRequest schemas.
"""

from pydantic import BaseModel, Field, field_validator
from email_validator import validate_email, EmailNotValidError
from typing import Optional
from datetime import datetime
from bson import ObjectId

class UserBase(BaseModel):
    # Use plain string here and validate with `email-validator` so we can
    # optionally allow more relaxed domains (e.g., local or experimental TLDs)
    email: str
    username: str
    full_name: str
    phone: str
    latitude: float
    longitude: float
    is_admin: bool = False

class UserCreate(BaseModel):
    email: str
    username: str
    full_name: str
    phone: str
    latitude: float
    longitude: float
    password: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Password must be no longer than 72 bytes')
        return v

    @field_validator('email')
    @classmethod
    def validate_email_field(cls, v: str) -> str:
        try:
            # `check_deliverability=False` will skip MX/TLD checks and make it
            # less strict if you want to accept non-standard TLDs in the contest.
            result = validate_email(v, check_deliverability=False)
            # Return normalized email
            return result.email
        except EmailNotValidError as e:
            raise ValueError(str(e))

class User(UserBase):
    # Use string id in API / OpenAPI for compatibility with Pydantic v2
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "validate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    identifier: str  # email or username
    password: str
