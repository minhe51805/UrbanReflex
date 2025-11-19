# UrbanReflex Backend

A modern FastAPI backend for UrbanReflex, built with Python and MongoDB.

## Features

- **Authentication**: JWT-based login and registration
- **User Management**: Secure user creation and profile management
- **RESTful API**: Clean and scalable API endpoints
- **CORS Support**: Ready for frontend integration (Next.js)
- **MongoDB Integration**: NoSQL database for flexible data storage

## Tech Stack

- **Framework**: FastAPI
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **ORM**: Motor (async MongoDB driver)
- **Package Manager**: uv

## Getting Started

### Prerequisites

- Python 3.10+
- MongoDB connection (configured in `app/config/config.py`)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/minhe51805/UrbanReflex.git
   cd urban-reflex
   ```

2. Install dependencies:

   ```bash
   uv sync
   ```

3. Run the application:
   ```bash
   uv run python main.py
   ```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

### Key Endpoints

- `POST /auth/register` - Register a new user
  Validation:
- Email validation uses `email-validator` to normalize the address. By default the server will accept valid syntactic emails even with non-standard (contest) TLDs — the parameter `check_deliverability=False` is set to skip MX/TLD checks. If you want strict checks, change the validator in `app/schemas/user.py` to use `check_deliverability=True` or switch back to `pydantic.EmailStr`.

- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info (requires authentication)

## Project Structure

```
app/
├── app.py          # FastAPI app instance
├── config/         # Configuration & settings
│   ├── __init__.py
│   ├── config.py   # MongoDB & JWT settings
│   └── data_model.py # Pydantic models (deprecated)
├── dependencies.py # Database dependency injection
├── internal/       # Internal modules
├── routers/        # API route endpoints
│   ├── __init__.py
│   ├── auth.py     # Authentication endpoints
│   ├── items.py    # Items endpoints
│   └── users.py    # Users endpoints
├── schemas/        # Pydantic request/response schemas
│   └── user.py     # User schemas
└── utils/          # Utility functions
    ├── __init__.py
    └── auth.py     # Authentication utilities

main.py            # Application entry point
```

## Environment Variables

Create a `.env` file in the root directory:

```
SECRET_KEY=your-secret-key-here
MONGODB_URL=your-mongodb-connection-string
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
