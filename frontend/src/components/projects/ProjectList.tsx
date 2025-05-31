import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PlusCircle as PlusCircleIcon } from 'lucide-react';
import { projectsAPI } from '../../services/api';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Not Started':
      return <Badge bg="secondary">Not Started</Badge>;
    case 'In Progress':
      return <Badge bg="primary">In Progress</Badge>;
    case 'Done':
      return <Badge bg="success">Done</Badge>;
    default:
      return <Badge bg="secondary">{status}</Badge>;
  }
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getProjects();
        // Filter out completed projects - they should only show in archives
        const activeProjects = data.filter(project => project.status !== 'Done');
        setProjects(activeProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const updateProjectStatus = async (id: number, newStatus: string) => {
    try {
      await projectsAPI.updateProject(id, { status: newStatus });
      
      if (newStatus === 'Done') {
        // Remove from current list since it's now archived
        setProjects(projects.filter(project => project.id !== id));
      } else {
        // Update the project in the list
        setProjects(projects.map(project => 
          project.id === id ? { ...project, status: newStatus } : project
        ));
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project status');
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading projects...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Projects</h2>
        <Link to="/projects/new">
          <Button variant="primary" className="d-flex align-items-center">
            <PlusCircleIcon size={18} className="me-1" />
            New Project
          </Button>
        </Link>
      </div>
      
      {projects.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h4>No projects found</h4>
            <p>Create your first project to get started</p>
            <Link to="/projects/new">
              <Button variant="primary">Create Project</Button>
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} className="g-4">
          {projects.map(project => (
            <Col key={project.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{project.name}</Card.Title>
                  <div className="mb-2">{getStatusBadge(project.status)}</div>
                  <Card.Text>{project.description}</Card.Text>
                  {project.start_date && project.end_date && (
                    <div className="d-flex justify-content-between mb-2">
                      <small className="text-muted">
                        Start: {new Date(project.start_date).toLocaleDateString()}
                      </small>
                      <small className="text-muted">
                        End: {new Date(project.end_date).toLocaleDateString()}
                      </small>
                    </div>
                  )}
                </Card.Body>
                <Card.Footer className="bg-white">
                  <div className="d-flex justify-content-between">
                    <Link to={`/projects/edit/${project.id}`}>
                      <Button variant="outline-primary" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <div>
                      {project.status !== 'Not Started' && (
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => updateProjectStatus(project.id, 'Not Started')}
                        >
                          Mark as Not Started
                        </Button>
                      )}
                      {project.status !== 'In Progress' && (
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => updateProjectStatus(project.id, 'In Progress')}
                        >
                          Mark as In Progress
                        </Button>
                      )}
                      {project.status !== 'Done' && (
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => updateProjectStatus(project.id, 'Done')}
                        >
                          Mark as Done
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ProjectList;