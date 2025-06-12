import { API_BASE_URL } from './config';

// Read (получение всех записей)
export const fetchPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/posts`);
  return response.json();
};

// Read (получение одной записи)
export const fetchPostById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`);
  return response.json();
};

// Create (создание)
export const createPost = async (postData) => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  return response.json();
};

// Update (полное обновление через PUT)
export const updatePost = async (id, postData) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  return response.json();
};

// Update (частичное обновление через PATCH)
export const patchPost = async (id, partialData) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partialData)
  });
  return response.json();
};

// Delete (удаление)
export const deletePost = async (id) => {
  await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE'
  });
};