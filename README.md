# TaskFlow

A modern task management application built with FastAPI, PostgreSQL, and Redis.

## Features

- User authentication with JWT
- Task management
- Real-time updates with Redis
- PostgreSQL database
- Docker support

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/TaskFlow.git
cd TaskFlow
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run with Docker Compose:
```bash
docker-compose up --build
```

The API will be available at http://localhost:8000

## API Documentation

Once the application is running, you can access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

- Backend: FastAPI
- Database: PostgreSQL
- Cache: Redis
- Authentication: JWT
- Container: Docker
