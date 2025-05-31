import React, { useEffect, useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { projectsAPI } from '../../services/api';

const ProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Not Started',
    start_date: new Date(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 14)) // Default to 2 weeks from now
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      const fetchProject = async () => {
        try {
          const response = await projectsAPI.getProject(parseInt(id));
          setFormData({
            ...response,
            start_date: new Date(response.start_date),
            end_date: new Date(response.end_date)
          });
        } catch (error) {
          setError('Failed to load project');
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateChange = (date: Date | null, field: string) => {
    if (date) {
      setFormData({
        ...formData,
        [field]: date
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const projectData = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        start_date: formData.start_date.toISOString().split('T')[0],
        end_date: formData.end_date.toISOString().split('T')[0]
      };

      if (isEditMode && id) {
        await projectsAPI.updateProject(parseInt(id), projectData);
      } else {
        await projectsAPI.createProject(projectData);
      }
      
      navigate('/projects');
    } catch (err) {
      setError('Failed to save project');
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="text-center py-5">Loading project...</div>;
  }

  return (
    <div className="d-flex justify-content-center">
      <Card className="shadow" style={{ width: '600px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">
            {isEditMode ? 'Edit Project' : 'Create New Project'}
          </h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter project name"
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
                placeholder="Enter project description"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange}>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </Form.Select>
            </Form.Group>

            <div className="row mb-3">
              <div className="col">
                <Form.Group controlId="start_date">
                  <Form.Label>Start Date</Form.Label>
                  <br />
                  <DatePicker
                    selected={formData.start_date}
                    onChange={(date) => handleDateChange(date, 'start_date')}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId="end_date">
                  <Form.Label>End Date</Form.Label>
                  <br />
                  <DatePicker
                    selected={formData.end_date}
                    onChange={(date) => handleDateChange(date, 'end_date')}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    minDate={formData.start_date}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={() => navigate('/projects')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Project'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProjectForm;