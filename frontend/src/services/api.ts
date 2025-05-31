import axios from 'axios';
// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
});
// Add a request interceptor to include auth token in headers
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});
// Add a response interceptor to handle common errors
api.interceptors.response.use(response => {
  return response;
}, error => {
  // Handle unauthorized errors (401)
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    // Redirect to frontend login page, not backend
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

// Authentication API functions
export const authAPI = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },
};

// Tasks API functions
export const tasksAPI = {
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  getTask: async (id: number) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (task: any) => {
    const response = await api.post('/tasks', task);
    return response.data;
  },

  updateTask: async (id: number, task: any) => {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
  },

  deleteTask: async (id: number) => {
    await api.delete(`/tasks/${id}`);
  },
};

// Projects API functions
export const projectsAPI = {
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getProject: async (id: number) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (project: any) => {
    const response = await api.post('/projects', project);
    return response.data;
  },

  updateProject: async (id: number, project: any) => {
    const response = await api.put(`/projects/${id}`, project);
    return response.data;
  },

  deleteProject: async (id: number) => {
    await api.delete(`/projects/${id}`);
  },
};

export default api;