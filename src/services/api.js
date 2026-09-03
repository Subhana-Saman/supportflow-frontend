import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('user');
        // Don't force-redirect for the silent "am I logged in?" check (used on
        // every page load, including the public landing page) or when the
        // user is already on a public page — that's what caused the landing
        // page to bounce straight to /login for logged-out visitors.
        const isSilentAuthCheck = error.config?.url?.includes('/auth/me');
        const publicPaths = ['/', '/login', '/register'];
        const onPublicPage = publicPaths.includes(window.location.pathname);
        if (!isSilentAuthCheck && !onPublicPage) {
          window.location.href = '/login';
        }
      }
      
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        toast.error('You do not have permission to perform this action');
      }
      
      // Handle 500 Server Error
      if (error.response.status >= 500) {
        toast.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      toast.error('Cannot connect to server. Please check if backend is running.');
    } else {
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default api;