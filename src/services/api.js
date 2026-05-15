const BASE_URL = 'http://localhost:5000/api';

const getToken = () => {
  const state = localStorage.getItem('authToken');
  return state ? state : null;
};

const request = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Auth
export const register = (data) =>
  fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const login = (data) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());

// Posts
export const fetchAllPosts    = ()         => request('/posts');
export const fetchPostById    = (id)       => request(`/posts/${id}`);
export const fetchPostsByUser = (userId)   => request(`/posts/user/${userId}`);
export const createPost       = (data)     => request('/posts', { method: 'POST', body: JSON.stringify(data) });
export const updatePost       = (id, data) => request(`/posts/${id}`, { method: 'PUT',  body: JSON.stringify(data) });
export const deletePost       = (id)       => request(`/posts/${id}`, { method: 'DELETE' });

// Users
export const fetchAllUsers = ()   => request('/users');
export const fetchUserById = (id) => request(`/users/${id}`);
