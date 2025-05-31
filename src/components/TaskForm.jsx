import { useState, useEffect } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function TaskForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: '',
    completed: false
  })
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects')
      setProjects(response.data)
    } catch (err) {
      setError('Failed to fetch projects')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/tasks', formData)
      navigate('/tasks')
    } catch (err) {
      setError('Failed to create task')
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '600px' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Create New Task</Card.Title>
          {error && <div className="text-danger mb-3">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Project</Form.Label>
              <Form.Select
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                required
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Completed"
                checked={formData.completed}
                onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
              />
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">
                Create Task
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default TaskForm