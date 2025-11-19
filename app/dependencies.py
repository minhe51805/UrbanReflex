from app.config.config import get_database

# Short wrapper for dependency
async def get_db():
    return await get_database()