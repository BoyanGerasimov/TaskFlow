# TaskFlow

A modern task management application built with FastAPI, React, PostgreSQL, and Redis.

## Features

- **Frontend**: React + TypeScript with Bootstrap UI
- **Backend**: FastAPI with async support
- **Authentication**: JWT-based user authentication
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Cache**: Redis for session management and caching
- **Task Management**: CRUD operations for projects and tasks
- **Real-time UI**: Dynamic status updates and archiving
- **Docker**: Full containerization with multi-stage builds
- **Testing**: 90% test coverage with pytest

## Quick Start with Docker (Recommended)

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/TaskFlow.git
cd TaskFlow
```

2. **Start all services:**
```bash
docker-compose up --build
```

3. **Setup database (required on first run):**
```bash
# Run database migrations
docker-compose exec backend bash -c "cd /app && alembic upgrade head"

# Optional: Seed database with sample data
docker-compose exec backend python seed.py
```

4. **Access the application:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Services Overview

The application runs the following services:

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | React application with Nginx |
| Backend | 8000 | FastAPI application |
| Database | 5432 | PostgreSQL database |
| Cache | 6379 | Redis cache |

## Development Setup

### Backend Development

1. **Create virtual environment:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run tests:**
```bash
pytest tests/ -v --cov=. --cov-report=term-missing
```

### Frontend Development

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Run tests:**
```bash
npm run test
```

## Database Management

### Initial Setup
```bash
# Create migration (if models changed)
docker-compose exec backend bash -c "cd /app && alembic revision --autogenerate -m 'description'"

# Apply migrations
docker-compose exec backend bash -c "cd /app && alembic upgrade head"

# Seed with sample data
docker-compose exec backend python seed.py
```

### Reset Database
```bash
# Stop services
docker-compose down

# Remove database volume
docker volume rm taskflow_postgres_data

# Restart and setup
docker-compose up -d
docker-compose exec backend bash -c "cd /app && alembic upgrade head"
```

## Health Checks

Monitor application health:

- **Basic health**: http://localhost:8000/health
- **Detailed health**: http://localhost:8000/health/detailed

## API Documentation

Once running, access the interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Testing

### Backend Tests
```bash
# Run all tests with coverage
docker-compose exec backend python -m pytest tests/ -v --cov=. --cov-report=term-missing

# Run specific test file
docker-compose exec backend python -m pytest tests/test_auth.py -v
```

**Test Coverage**: 90% (21 tests covering authentication, CRUD operations, and health checks)

### Frontend Tests (Coming Soon)
```bash
cd frontend
npm run test
npm run test:coverage
```

## Project Structure

```
TaskFlow/
├── backend/                 # FastAPI backend
│   ├── core/               # Core functionality (security, cache, middleware)
│   ├── models/             # SQLAlchemy models
│   ├── routers/            # API route handlers
│   ├── schemas/            # Pydantic schemas
│   ├── tests/              # Test suite (90% coverage)
│   ├── main.py             # FastAPI application
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   └── services/       # API service layer
│   ├── Dockerfile          # Multi-stage build
│   ├── nginx.conf          # Production Nginx config
│   └── package.json        # Node dependencies
├── alembic/                # Database migrations
├── docker-compose.yml      # Multi-service setup
└── ARCHITECTURE.md         # Detailed architecture docs
```

## Security Features

- JWT authentication with token expiration
- Rate limiting middleware
- Input sanitization
- Security headers (X-Frame-Options, XSS Protection, etc.)
- CORS configuration
- Password hashing with bcrypt

## Production Deployment

The application is production-ready with:
- Multi-stage Docker builds
- Nginx for static file serving
- Health check endpoints for monitoring
- Comprehensive logging
- Error handling middleware
- Security headers and rate limiting

For production deployment, update environment variables and use proper secrets management.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Ensure test coverage > 80%
5. Submit a pull request

## License

This project is licensed under the MIT License.
