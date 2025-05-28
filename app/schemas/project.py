from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from .task import Task

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class Project(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
    tasks: List[Task] = []

    class Config:
        from_attributes = True 