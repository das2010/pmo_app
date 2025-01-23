// frontend/src/services/permissionGroupService.js
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/permission-groups';

// CRUD Grupos
export async function getGroups() {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function createGroup(groupData) {
  const response = await axios.post(API_URL, groupData);
  return response.data;
}

export async function updateGroup(id, groupData) {
  const response = await axios.put(`${API_URL}/${id}`, groupData);
  return response.data;
}

export async function deleteGroup(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}

// Módulos asignados
export async function getModulesByGroup(groupId) {
  const response = await axios.get(`${API_URL}/${groupId}/modules`);
  return response.data;
}

export async function assignModuleToGroup(groupId, moduleId) {
  const response = await axios.post(`${API_URL}/${groupId}/modules`, { module_id: moduleId });
  return response.data;
}

export async function unassignModuleFromGroup(groupId, moduleId) {
  const response = await axios.delete(`${API_URL}/${groupId}/modules/${moduleId}`);
  return response.data;
}
