import axios from 'axios';

const API_URL = 'http://localhost:4000/api/sectors';

export async function getSectors() {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function createSector(sectorData) {
  const response = await axios.post(API_URL, sectorData);
  return response.data;
}

export async function updateSector(id, sectorData) {
  const response = await axios.put(`${API_URL}/${id}`, sectorData);
  return response.data;
}

export async function deleteSector(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}
