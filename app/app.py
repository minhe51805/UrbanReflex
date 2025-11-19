from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import items, users, auth

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