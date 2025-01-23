// pmo-app/frontend/src/services/serviceService.js

import axios from 'axios';

const API_URL = 'http://localhost:4000/api/services';

/* =========================================================================
   CRUD de SERVICIOS (tabla "services")
   ========================================================================= */

/**
 * Retorna la lista de todos los servicios
 */
export async function getServices() {
  const response = await axios.get(API_URL);
  return response.data;
}

/**
 * Crea un nuevo servicio
 * @param {Object} serviceData 
 *   { client_id, description, opportunity_number, start_date, end_date }
 */
export async function createService(serviceData) {
  const response = await axios.post(API_URL, serviceData);
  return response.data;
}

/**
 * Actualiza un servicio existente
 * @param {Number} id 
 * @param {Object} serviceData 
 */
export async function updateService(id, serviceData) {
  const response = await axios.put(`${API_URL}/${id}`, serviceData);
  return response.data;
}

/**
 * Elimina un servicio por ID
 * @param {Number} id 
 */
export async function deleteService(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}

/* =========================================================================
   CRUD de ASIGNACIÓN de RECURSOS (tabla "service_assigned_resources")
   ========================================================================= */

/**
 * Obtiene la lista de recursos asignados a un servicio
 * @param {Number} serviceId 
 * @returns {Array} [{id, service_id, resource_id, resource_name, resource_lastname, sector_name}, ...]
 */
export async function getAssignedResources(serviceId) {
  const url = `${API_URL}/${serviceId}/assigned-resources`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * Asigna un recurso a un servicio (sin horas semanales)
 * @param {Number} serviceId 
 * @param {Number} resourceId 
 */
export async function assignResource(serviceId, resourceId) {
  const url = `${API_URL}/${serviceId}/assigned-resources`;
  const response = await axios.post(url, { resource_id: resourceId });
  return response.data;
}

/**
 * Desasigna (elimina) el recurso asignado (por el id de la fila 'service_assigned_resources')
 * @param {Number} assignedId 
 */
export async function unassignResource(assignedId) {
  const url = `${API_URL}/assigned-resources/${assignedId}`;
  const response = await axios.delete(url);
  return response.data;
}

/* =========================================================================
   CRUD de ASIGNACIONES SEMANALES (tabla "service_resource_allocations")
   ========================================================================= */

/**
 * Obtiene la lista de asignaciones semanales de un servicio
 * @param {Number} serviceId 
 * @returns {Array} con objetos { id, service_id, resource_id, week_date, hours, resource_name, sector_name, ...}
 */
export async function getAllocations(serviceId) {
  const url = `${API_URL}/${serviceId}/allocations`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * Crea una asignación (semana, recurso) dentro de un servicio
 * @param {Number} serviceId 
 * @param {Object} allocData { resource_id, week_date, hours }
 */
export async function createAllocation(serviceId, allocData) {
  const url = `${API_URL}/${serviceId}/allocations`;
  const response = await axios.post(url, allocData);
  return response.data;
}

/**
 * Actualiza las horas de una asignación semanal existente
 * @param {Number} allocationId 
 * @param {Object} allocData { hours }
 */
export async function updateAllocation(allocationId, allocData) {
  const url = `${API_URL}/allocations/${allocationId}`;
  const response = await axios.put(url, allocData);
  return response.data;
}

/**
 * Elimina una asignación semanal (por id de 'service_resource_allocations')
 * @param {Number} allocationId 
 */
export async function deleteAllocation(allocationId) {
  const url = `${API_URL}/allocations/${allocationId}`;
  const response = await axios.delete(url);
  return response.data;
}
