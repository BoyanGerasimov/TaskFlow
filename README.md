# TaskFlow

A modern task management application built with FastAPI, React, PostgreSQL, and Redis.
testing for ci
## 📖 User Stories

### Core User Stories

**As a project manager, I want to:**
- Create and manage multiple projects so that I can organize my work efficiently
- Set project deadlines and track progress so that I can meet delivery commitments
- Archive completed projects so that I can maintain a clean workspace while preserving history

**As a team member, I want to:**
- View all my assigned tasks in one place so that I can prioritize my daily work
- Update task status and completion so that the team knows my progress
- Filter tasks by priority and due date so that I can focus on urgent items

**As a user, I want to:**
- Register and securely log in so that my data is protected and personalized
- Access the application from any device so that I can work remotely
- Receive visual feedback on task and project status so that I can quickly assess progress

### Advanced User Stories

**As a team lead, I want to:**
- Assign tasks to specific projects so that work is properly categorized
- Set task priorities (High/Medium/Low) so that team members know what to focus on
- View archived projects so that I can reference completed work

**As a productivity-focused user, I want to:**
- See a dashboard of all my projects and tasks so that I get a quick overview
- Use keyboard shortcuts and intuitive UI so that I can work efficiently
- Have my session maintained across browser refreshes so that I don't lose my work

## 🎯 Use Cases

### Primary Use Cases

#### UC1: Project Management Workflow
**Actor**: Project Manager  
**Goal**: Create and manage a complete project lifecycle  
**Precondition**: User is authenticated  

**Main Success Scenario**:
1. User creates a new project with name, description, and timeline
2. User sets project status (Not Started/In Progress/Done)
3. User creates tasks within the project
4. User assigns priorities and due dates to tasks
5. User tracks progress by updating task completion status
6. User archives project when completed

**Alternative Flows**:
- If project needs modification, user can edit project details
- If project is cancelled, user can delete project (with confirmation)

#### UC2: Daily Task Management
**Actor**: Team Member  
**Goal**: Manage daily task workflow efficiently  
**Precondition**: User is authenticated and has assigned tasks  

**Main Success Scenario**:
1. User views task list sorted by priority/due date
2. User selects a task to work on
3. User updates task progress and adds notes
4. User marks task as completed when finished
5. User moves to next priority task

**Alternative Flows**:
- If task details need changes, user can edit task information
- If task becomes irrelevant, user can delete task
- If task needs different priority, user can update priority level

#### UC3: User Authentication & Session Management
**Actor**: Any User  
**Goal**: Secure access to personal task management data  
**Precondition**: User has valid account or needs to create one  

**Main Success Scenario**:
1. New user registers with username, email, and password
2. User logs in with credentials
3. System provides JWT token for session management
4. User accesses protected features with active session
5. User logs out to end session

**Alternative Flows**:
- If credentials are invalid, system shows error message
- If session expires, user is redirected to login
- If registration fails, system provides specific error feedback

### Secondary Use Cases

#### UC4: Project Archive Management
**Actor**: Project Manager  
**Goal**: Maintain organized workspace with completed project history  

**Scenario**: User completes a project, marks it as "Done", and accesses it later from the archived projects section for reference.

#### UC5: Multi-device Access
**Actor**: Remote Worker  
**Goal**: Access task management from different devices  

**Scenario**: User logs in from office computer, updates tasks, then later accesses the same data from mobile device or home computer.

#### UC6: Data Persistence & Recovery
**Actor**: Any User  
**Goal**: Ensure work is not lost due to technical issues  

**Scenario**: User's browser crashes or internet disconnects; when reconnecting, all data and progress are preserved.

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
