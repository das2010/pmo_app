import React, { useEffect, useState } from 'react';
import {
  getResources,
  createResource,
  updateResource,
  deleteResource
} from '../services/resourceService';
import { getSectors } from '../services/sectorService';
import { getProfiles } from '../services/profileService';
import ResourceForm from './ResourceForm';
import ResourceAvailabilityManager from './ResourceAvailabilityManager';

function ResourcesList() {
  const [resources, setResources] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [profiles, setProfiles] = useState([]);

  const [selectedResource, setSelectedResource] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Para mostrar/ocultar la gestión de disponibilidades
  const [availabilityResource, setAvailabilityResource] = useState(null);

  useEffect(() => {
    fetchResources();
    fetchSectors();
    fetchProfiles();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await getResources();
      setResources(data);
    } catch (error) {
      console.error('Error al obtener recursos:', error);
    }
  };

  const fetchSectors = async () => {
    try {
      const data = await getSectors();
      setSectors(data);
    } catch (error) {
      console.error('Error al obtener sectores:', error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const data = await getProfiles();
      setProfiles(data);
    } catch (error) {
      console.error('Error al obtener perfiles:', error);
    }
  };

  const handleCreate = () => {
    setSelectedResource(null);
    setShowForm(true);
  };

  const handleEdit = (resource) => {
    setSelectedResource(resource);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este recurso?')) {
      await deleteResource(id);
      fetchResources();
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedResource) {
        await updateResource(selectedResource.id, formData);
      } else {
        await createResource(formData);
      }
      setShowForm(false);
      setSelectedResource(null);
      fetchResources();
    } catch (error) {
      console.error('Error al guardar recurso:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedResource(null);
  };

  const handleOpenAvailability = (resource) => {
    setAvailabilityResource(resource);
  };

  const handleCloseAvailability = () => {
    setAvailabilityResource(null);
  };

  return (
    <div>
      <h2>Administrar Recursos</h2>
      {!showForm && !availabilityResource && (
        <button onClick={handleCreate}>Crear Recurso</button>
      )}

      {showForm && (
        <ResourceForm
          resource={selectedResource}
          sectors={sectors}
          profiles={profiles}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {!showForm && !availabilityResource && (
        <table border="1" cellPadding="5" style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Sector</th>
              <th>Perfil</th>
              <th>País</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.lastname}</td>
                <td>{r.dni || ''}</td>
                <td>{r.sector_name}</td>
                <td>{r.profile_name}</td>
                <td>{r.country}</td>
                <td>
                  <button onClick={() => handleEdit(r)}>Editar</button>
                  <button onClick={() => handleDelete(r.id)}>Eliminar</button>
                  <button onClick={() => handleOpenAvailability(r)}>
                    Disponibilidad
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {availabilityResource && (
        <ResourceAvailabilityManager
          resource={availabilityResource}
          onClose={handleCloseAvailability}
        />
      )}
    </div>
  );
}

export default ResourcesList;
