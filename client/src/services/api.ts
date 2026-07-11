import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach the JWT token if it exists in local storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 unauthorized errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and related user info from storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Hard redirect to the login page
      const currentPath = `${window.location.pathname}${window.location.search}`;
      const redirectTarget =
        window.location.pathname.startsWith('/invite/')
          ? `/login?redirect=${encodeURIComponent(window.location.pathname)}`
          : '/login';

      window.location.href = currentPath.startsWith('/login') ? '/login' : redirectTarget;
    }
    return Promise.reject(error);
  }
);

export default api;
