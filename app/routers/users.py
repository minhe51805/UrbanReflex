from fastapi import APIRouter

router = APIRouter()

@router.get("/users/")
async def read_users():
    return [{"user_id": "User1"}]
