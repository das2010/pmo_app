import axios from 'axios';

const API_URL = 'http://localhost:4000/api/profiles';

export async function getProfiles() {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function createProfile(profileData) {
  const response = await axios.post(API_URL, profileData);
  return response.data;
}

export async function updateProfile(id, profileData) {
  const response = await axios.put(`${API_URL}/${id}`, profileData);
  return response.data;
}

export async function deleteProfile(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}
