import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PlusCircle as PlusCircleIcon } from 'lucide-react';
import { tasksAPI } from '../../services/api';

const getStatusBadge = (completed: boolean) => {
  return completed ? (
    <Badge bg="success">Done</Badge>
  ) : (
    <Badge bg="primary">In Progress</Badge>
  );
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'High':
      return <Badge bg="danger">High</Badge>;
    case 'Medium':
      return <Badge bg="warning">Medium</Badge>;
    case 'Low':
      return <Badge bg="secondary">Low</Badge>;
    default:
      return <Badge bg="secondary">{priority}</Badge>;
  }
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await tasksAPI.getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const updateTaskStatus = async (id: number, completed: boolean) => {
    try {
      await tasksAPI.updateTask(id, { completed });
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task status');
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading tasks...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tasks</h2>
        <Link to="/tasks/new">
          <Button variant="primary" className="d-flex align-items-center">
            <PlusCircleIcon size={18} className="me-1" />
            New Task
          </Button>
        </Link>
      </div>
      
      {tasks.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h4>No tasks found</h4>
            <p>Create your first task to get started</p>
            <Link to="/tasks/new">
              <Button variant="primary">Create Task</Button>
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td>
                      <Link to={`/tasks/edit/${task.id}`} className="text-decoration-none">
                        {task.title}
                      </Link>
                      {task.description && (
                        <div className="text-muted small">{task.description}</div>
                      )}
                    </td>
                    <td>{getPriorityBadge(task.priority)}</td>
                    <td>{getStatusBadge(task.completed)}</td>
                    <td>
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                    </td>
                    <td>
                      <div className="d-flex">
                        <Link to={`/tasks/edit/${task.id}`} className="me-2">
                          <Button variant="outline-primary" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button 
                          variant={task.completed ? "outline-warning" : "outline-success"} 
                          size="sm"
                          onClick={() => updateTaskStatus(task.id, !task.completed)}
                        >
                          {task.completed ? "Mark Incomplete" : "Mark Complete"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default TaskList;