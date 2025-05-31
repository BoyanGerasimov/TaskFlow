import pytest
from fastapi import status
from datetime import date

def test_create_project(client, auth_headers):
    """Test creating a new project."""
    project_data = {
        "name": "Test Project",
        "description": "A test project",
        "status": "Not Started",
        "start_date": "2024-01-01",
        "end_date": "2024-12-31"
    }
    response = client.post("/projects", json=project_data, headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == project_data["name"]
    assert data["description"] == project_data["description"]
    assert data["status"] == project_data["status"]

def test_create_project_unauthorized(client):
    """Test creating project without authentication."""
    project_data = {
        "name": "Test Project",
        "description": "A test project"
    }
    response = client.post("/projects", json=project_data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_get_projects(client, auth_headers, test_user, db_session):
    """Test retrieving projects."""
    from models import Project
    
    # Create test project
    project = Project(
        name="Test Project",
        description="Test description",
        status="In Progress",
        owner_id=test_user.id
    )
    db_session.add(project)
    db_session.commit()
    
    response = client.get("/projects", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1
    assert any(p["name"] == "Test Project" for p in data)

def test_get_project_by_id(client, auth_headers, test_user, db_session):
    """Test retrieving a specific project."""
    from models import Project
    
    project = Project(
        name="Specific Project",
        description="Specific description",
        owner_id=test_user.id
    )
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    
    response = client.get(f"/projects/{project.id}", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "Specific Project"
    assert data["id"] == project.id

def test_update_project(client, auth_headers, test_user, db_session):
    """Test updating a project."""
    from models import Project
    
    project = Project(
        name="Original Name",
        description="Original description",
        owner_id=test_user.id
    )
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    
    update_data = {
        "name": "Updated Name",
        "status": "In Progress"
    }
    response = client.put(f"/projects/{project.id}", json=update_data, headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["status"] == "In Progress"

def test_delete_project(client, auth_headers, test_user, db_session):
    """Test deleting a project."""
    from models import Project
    
    project = Project(
        name="To Delete",
        description="Will be deleted",
        owner_id=test_user.id
    )
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    
    response = client.delete(f"/projects/{project.id}", headers=auth_headers)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    
    # Verify it's deleted
    response = client.get(f"/projects/{project.id}", headers=auth_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND 