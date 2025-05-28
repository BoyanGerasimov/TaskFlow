from sqlalchemy.orm import Session
from app.models import User, Project, Task
from app.core.security import get_password_hash

def seed_database(db: Session):
    """Seed the database with initial data."""
    # Check if test user exists
    test_user = db.query(User).filter(User.email == "test@example.com").first()
    if not test_user:
        test_user = User(
            username="testuser",
            email="test@example.com",
            hashed_password=get_password_hash("password123")
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)

    # Check if sample project exists
    project = db.query(Project).filter(
        Project.title == "Sample Project",
        Project.owner_id == test_user.id
    ).first()
    
    if not project:
        project = Project(
            title="Sample Project",
            description="A sample project for testing",
            owner_id=test_user.id
        )
        db.add(project)
        db.commit()
        db.refresh(project)

    # Create sample tasks if they don't exist
    existing_tasks = db.query(Task).filter(
        Task.project_id == project.id,
        Task.owner_id == test_user.id
    ).count()

    if existing_tasks == 0:
        tasks = [
            Task(
                title="Complete API documentation",
                description="Write comprehensive API documentation",
                project_id=project.id,
                owner_id=test_user.id
            ),
            Task(
                title="Implement frontend",
                description="Create React frontend for the application",
                project_id=project.id,
                owner_id=test_user.id
            ),
            Task(
                title="Write tests",
                description="Add unit and integration tests",
                project_id=project.id,
                owner_id=test_user.id
            )
        ]
        
        for task in tasks:
            db.add(task)
        
        db.commit()

if __name__ == "__main__":
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        seed_database(db)
        print("Database seeded successfully!")
    finally:
        db.close() 