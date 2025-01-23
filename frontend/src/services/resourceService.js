import axios from 'axios';

const API_URL = 'http://localhost:4000/api/resources';

// CRUD Recursos
export async function getResources() {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function createResource(data) {
  const response = await axios.post(API_URL, data);
  return response.data;
}

export async function updateResource(id, data) {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
}

export async function deleteResource(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}

// CRUD Disponibilidad (availabilities)
export async function getAvailabilities(resourceId) {
  // GET /api/resources/:resourceId/availabilities
  const url = `${API_URL}/${resourceId}/availabilities`;
  const response = await axios.get(url);
  return response.data;
}

export async function createAvailability(resourceId, data) {
  // POST /api/resources/:resourceId/availabilities
  const url = `${API_URL}/${resourceId}/availabilities`;
  const response = await axios.post(url, data);
  return response.data;
}

export async function updateAvailability(id, data) {
  // PUT /api/resources/availabilities/:id
  const url = `${API_URL}/availabilities/${id}`;
  const response = await axios.put(url, data);
  return response.data;
}

export async function deleteAvailability(id) {
  // DELETE /api/resources/availabilities/:id
  const url = `${API_URL}/availabilities/${id}`;
  const response = await axios.delete(url);
  return response.data;
}
