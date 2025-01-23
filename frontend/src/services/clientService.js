import axios from 'axios';

const API_URL = 'http://localhost:4000/api/clients';

// CRUD Clientes
export async function getClients() {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function createClient(data) {
  const response = await axios.post(API_URL, data);
  return response.data;
}

export async function updateClient(id, data) {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
}

export async function deleteClient(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}

// CRUD Contactos
export async function getContacts(clientId) {
  const url = `${API_URL}/${clientId}/contacts`;
  const response = await axios.get(url);
  return response.data;
}

export async function createContact(clientId, data) {
  const url = `${API_URL}/${clientId}/contacts`;
  const response = await axios.post(url, data);
  return response.data;
}

export async function updateContact(contactId, data) {
  const url = `${API_URL}/contacts/${contactId}`;
  const response = await axios.put(url, data);
  return response.data;
}

export async function deleteContact(contactId) {
  const url = `${API_URL}/contacts/${contactId}`;
  const response = await axios.delete(url);
  return response.data;
}
