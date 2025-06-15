import { API_BASE_URL } from './config';

export const fetchPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/posts`);
  return response.json();
};

export const fetchPostById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`);
  return response.json();
};

export const createPost = async (postData) => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  return response.json();
};

export const updatePost = async (id, postData) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  return response.json();
};

export const patchPost = async (id, partialData) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partialData)
  });
  return response.json();
};

export const deletePost = async (id) => {
  await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE'
  });
};