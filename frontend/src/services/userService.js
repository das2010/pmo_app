// frontend/src/services/userService.js
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/users';

export async function getUsers() {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function createUser(userData) {
  const response = await axios.post(API_URL, userData);
  return response.data;
}

export async function updateUser(id, userData) {
  const response = await axios.put(`${API_URL}/${id}`, userData);
  return response.data;
}

export async function deleteUser(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}