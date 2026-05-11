const BASE_URL = 'https://jsonplaceholder.typicode.com';

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  return response.json();
};

// Posts
export const fetchAllPosts    = ()         => request('/posts');
export const fetchPostById    = (id)       => request(`/posts/${id}`);
export const fetchPostsByUser = (userId)   => request(`/posts?userId=${userId}`);
export const createPost       = (data)     => request('/posts', { method: 'POST', body: JSON.stringify(data) });
export const updatePost       = (id, data) => request(`/posts/${id}`, { method: 'PUT',  body: JSON.stringify(data) });
export const deletePost       = (id)       => request(`/posts/${id}`, { method: 'DELETE' });

// Comments
export const fetchCommentsByPost = (postId) => request(`/posts/${postId}/comments`);

// Users
export const fetchAllUsers = ()   => request('/users');
export const fetchUserById = (id) => request(`/users/${id}`);
