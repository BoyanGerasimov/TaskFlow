import { useState, useEffect } from 'react'
import { Table, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks')
      setTasks(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch tasks')
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`)
      setTasks(tasks.filter(task => task.id !== id))
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-danger">{error}</div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tasks</h2>
        <Button as={Link} to="/tasks/new" variant="primary">Create Task</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Project</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <Badge bg={task.completed ? "success" : "warning"}>
                  {task.completed ? "Completed" : "Pending"}
                </Badge>
              </td>
              <td>{task.project_id}</td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                  className="ms-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default TaskList