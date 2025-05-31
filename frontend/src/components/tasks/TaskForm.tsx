import React, { useEffect, useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { tasksAPI, projectsAPI } from '../../services/api';

const TaskForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false,
    priority: 'Medium',
    due_date: new Date(new Date().setDate(new Date().getDate() + 7)), // Default to 1 week from now
    project_id: null
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch projects for dropdown
        const projectsData = await projectsAPI.getProjects();
        setProjects(projectsData);

        if (isEditMode && id) {
          // Fetch task data for editing
          const taskData = await tasksAPI.getTask(parseInt(id));
          setFormData({
            ...taskData,
            due_date: taskData.due_date ? new Date(taskData.due_date) : new Date()
          });
        }
      } catch (error) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value === '' ? null : value
      });
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      due_date: date
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const taskData = {
        ...formData,
        due_date: formData.due_date ? formData.due_date.toISOString().split('T')[0] : null,
        project_id: formData.project_id ? parseInt(formData.project_id.toString()) : null
      };

      if (isEditMode && id) {
        await tasksAPI.updateTask(parseInt(id), taskData);
      } else {
        await tasksAPI.createTask(taskData);
      }
      
      navigate('/tasks');
    } catch (err) {
      setError('Failed to save task');
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="text-center py-5">Loading task...</div>;
  }

  return (
    <div className="d-flex justify-content-center">
      <Card className="shadow" style={{ width: '600px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">
            {isEditMode ? 'Edit Task' : 'Create New Task'}
          </h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter task title"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="project_id">
              <Form.Label>Project (Optional)</Form.Label>
              <Form.Select 
                name="project_id" 
                value={formData.project_id || ''} 
                onChange={handleChange}
              >
                <option value="">No project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="priority">
              <Form.Label>Priority</Form.Label>
              <Form.Select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="completed">
              <Form.Check
                type="checkbox"
                name="completed"
                label="Mark as completed"
                checked={formData.completed}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="due_date">
              <Form.Label>Due Date (Optional)</Form.Label>
              <br />
              <DatePicker
                selected={formData.due_date}
                onChange={handleDateChange}
                className="form-control"
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                isClearable
                placeholderText="Select due date"
              />
            </Form.Group>

            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={() => navigate('/tasks')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Task'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TaskForm;