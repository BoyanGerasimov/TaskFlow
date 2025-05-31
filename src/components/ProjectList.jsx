import { useState, useEffect } from 'react'
import { Table, Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function ProjectList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects')
      setProjects(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch projects')
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`)
      setProjects(projects.filter(project => project.id !== id))
    } catch (err) {
      setError('Failed to delete project')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-danger">{error}</div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Projects</h2>
        <Button as={Link} to="/projects/new" variant="primary">Create Project</Button>
      </div>
      <div className="row">
        {projects.map(project => (
          <div key={project.id} className="col-md-4 mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{project.title}</Card.Title>
                <Card.Text>{project.description}</Card.Text>
                <Card.Text>
                  <small className="text-muted">
                    Tasks: {project.tasks?.length || 0}
                  </small>
                </Card.Text>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectList