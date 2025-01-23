// pmo-app/frontend/src/components/ResourceAvailabilityManager.js

import React, { useEffect, useState } from 'react';
import {
  getAvailabilities,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from '../services/resourceService';

// Importamos el formulario de disponibilidad (archivo separado)
import AvailabilityForm from './AvailabilityForm';

function ResourceAvailabilityManager({ resource, onClose }) {
  const [availabilities, setAvailabilities] = useState([]);
  const [editingAvailability, setEditingAvailability] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Cargar las disponibilidades cuando se reciba "resource" o cambie
  useEffect(() => {
    if (resource) {
      fetchAvailabilities(resource.id);
    }
  }, [resource]);

  // Trae la lista de disponibilidades desde el backend
  const fetchAvailabilities = async (resourceId) => {
    try {
      const data = await getAvailabilities(resourceId);
      setAvailabilities(data);
    } catch (error) {
      console.error('Error al obtener disponibilidades:', error);
    }
  };

  // Preparar la creación de una nueva disponibilidad
  const handleCreate = () => {
    setEditingAvailability(null);
    setShowForm(true);
  };

  // Preparar la edición de una disponibilidad existente
  const handleEdit = (av) => {
    setEditingAvailability(av);
    setShowForm(true);
  };

  // Eliminar un registro de disponibilidad
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro de disponibilidad?')) {
      await deleteAvailability(id);
      fetchAvailabilities(resource.id);
    }
  };

  // Guardar la disponibilidad (crear o actualizar)
  const handleSave = async (formData) => {
    try {
      if (editingAvailability) {
        // Actualizar
        await updateAvailability(editingAvailability.id, {
          ...formData,
          resource_id: resource.id,
        });
      } else {
        // Crear
        await createAvailability(resource.id, {
          ...formData,
          resource_id: resource.id,
        });
      }
      // Ocultar formulario y refrescar la lista
      setShowForm(false);
      setEditingAvailability(null);
      fetchAvailabilities(resource.id);
    } catch (error) {
      alert(error.response?.data?.error || 'Error al guardar disponibilidad');
      console.error('Error al guardar disponibilidad:', error);
    }
  };

  // Cancelar creación/edición
  const handleCancel = () => {
    setShowForm(false);
    setEditingAvailability(null);
  };

  return (
    <div style={{ marginTop: '20px', border: '1px solid #aaa', padding: '10px' }}>
      <h3>Disponibilidad de: {resource.name} {resource.lastname}</h3>
      
      {!showForm && (
        <button onClick={handleCreate}>Agregar Disponibilidad</button>
      )}
      {' '}
      <button onClick={onClose}>Cerrar</button>

      {showForm ? (
        // Renderizamos el formulario externo
        <AvailabilityForm
          availability={editingAvailability}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        // Renderizamos la tabla de disponibilidades
        <table style={{ marginTop: '10px' }} border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Desde</th>
              <th>Hasta</th>
              <th>Horas Diarias</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {availabilities.map((av) => (
              <tr key={av.id}>
                <td>{av.from_date}</td>
                <td>{av.to_date}</td>
                <td>{av.daily_hours}</td>
                <td>
                  <button onClick={() => handleEdit(av)}>Editar</button>
                  <button onClick={() => handleDelete(av.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ResourceAvailabilityManager;