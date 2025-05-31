import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowLeft as ArrowLeftIcon } from 'lucide-react';
import { projectsAPI } from '../../services/api';

const ArchivedProjects = () => {
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArchivedProjects = async () => {
      try {
        const allProjects = await projectsAPI.getProjects();
        // Filter projects with status "Done"
        const archived = allProjects.filter(project => project.status === 'Done');
        setArchivedProjects(archived);
      } catch (error) {
        console.error('Error fetching archived projects:', error);
        setError('Failed to load archived projects');
      } finally {
        setLoading(false);
      }
    };
    fetchArchivedProjects();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading archived projects...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <Link to="/projects" className="me-3">
          <Button variant="outline-secondary" size="sm">
            <ArrowLeftIcon size={16} className="me-1" />
            Back to Projects
          </Button>
        </Link>
        <h2 className="mb-0">Archived Projects</h2>
      </div>
      
      {archivedProjects.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h4>No archived projects</h4>
            <p>Completed projects will appear here</p>
            <Link to="/projects">
              <Button variant="primary">Back to Projects</Button>
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} className="g-4">
          {archivedProjects.map(project => (
            <Col key={project.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{project.name}</Card.Title>
                  <div className="mb-2">
                    <Badge bg="success">Completed</Badge>
                  </div>
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
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ArchivedProjects;