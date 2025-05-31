import pytest
from fastapi import status
from datetime import date

def test_create_task(client, auth_headers):
    """Test creating a new task."""
    task_data = {
        "title": "Test Task",
        "description": "A test task",
        "priority": "High",
        "due_date": "2024-12-31"
    }
    response = client.post("/tasks", json=task_data, headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["description"] == task_data["description"]
    assert data["priority"] == task_data["priority"]
    assert data["completed"] is False

def test_create_task_with_project(client, auth_headers, test_user, db_session):
    """Test creating a task with project assignment."""
    from models import Project
    
    project = Project(
        name="Test Project",
        description="Project for task",
        owner_id=test_user.id
    )
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    
    task_data = {
        "title": "Project Task",
        "description": "Task with project",
        "project_id": project.id
    }
    response = client.post("/tasks", json=task_data, headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["project_id"] == project.id

def test_get_tasks(client, auth_headers, test_user, db_session):
    """Test retrieving tasks."""
    from models import Task
    
    task = Task(
        title="Test Task",
        description="Test description",
        priority="Medium",
        owner_id=test_user.id
    )
    db_session.add(task)
    db_session.commit()
    
    response = client.get("/tasks", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1
    assert any(t["title"] == "Test Task" for t in data)

def test_update_task_completion(client, auth_headers, test_user, db_session):
    """Test updating task completion status."""
    from models import Task
    
    task = Task(
        title="Incomplete Task",
        description="Task to complete",
        completed=False,
        owner_id=test_user.id
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    
    update_data = {"completed": True}
    response = client.put(f"/tasks/{task.id}", json=update_data, headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["completed"] is True

def test_update_task_priority(client, auth_headers, test_user, db_session):
    """Test updating task priority."""
    from models import Task
    
    task = Task(
        title="Priority Task",
        description="Task to update priority",
        priority="Low",
        owner_id=test_user.id
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    
    update_data = {"priority": "High"}
    response = client.put(f"/tasks/{task.id}", json=update_data, headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["priority"] == "High"

def test_delete_task(client, auth_headers, test_user, db_session):
    """Test deleting a task."""
    from models import Task
    
    task = Task(
        title="To Delete",
        description="Will be deleted",
        owner_id=test_user.id
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    
    response = client.delete(f"/tasks/{task.id}", headers=auth_headers)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    
    # Verify it's deleted
    response = client.get(f"/tasks/{task.id}", headers=auth_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_task_unauthorized_access(client):
    """Test accessing tasks without authentication."""
    response = client.get("/tasks")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED 