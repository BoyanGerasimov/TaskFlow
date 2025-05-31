import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProjectList from './components/projects/ProjectList';
import ProjectForm from './components/projects/ProjectForm';
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/TaskForm';
import ArchivedProjects from './components/projects/ArchivedProjects';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavBar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Container className="py-4 flex-grow-1">
          <Routes>
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/projects" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/projects" /> : <Register onLogin={handleLogin} />} 
            />
            <Route 
              path="/projects" 
              element={isAuthenticated ? <ProjectList /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/projects/new" 
              element={isAuthenticated ? <ProjectForm /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/projects/edit/:id" 
              element={isAuthenticated ? <ProjectForm /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/projects/archived" 
              element={isAuthenticated ? <ArchivedProjects /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/tasks" 
              element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/tasks/new" 
              element={isAuthenticated ? <TaskForm /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/tasks/edit/:id" 
              element={isAuthenticated ? <TaskForm /> : <Navigate to="/login" />} 
            />
            <Route 
              path="*" 
              element={<Navigate to={isAuthenticated ? '/projects' : '/login'} />} 
            />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}