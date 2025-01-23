import axios from 'axios';

const API_URL = 'http://localhost:4000/api/modules';

export async function getAllModules() {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function getModuleById(id) {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

export async function createModule(moduleData) {
  const response = await axios.post(API_URL, moduleData);
  return response.data;
}

export async function updateModule(id, moduleData) {
  const response = await axios.put(`${API_URL}/${id}`, moduleData);
  return response.data;
}

export async function deleteModule(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}
