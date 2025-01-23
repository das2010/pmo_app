// pmo-app/frontend/src/components/ServicesList.js

import React, { useEffect, useState } from 'react';
import {
  getServices,
  createService,
  updateService,
  deleteService
} from '../services/serviceService';

import ServiceForm from './ServiceForm';
import ServiceAssignedResources from './ServiceAssignedResources';
import ServiceAssignmentGrid from './ServiceAssignmentGrid';

function ServicesList() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Subvistas:
  //  - assignedView: para mostrar "Recursos Asignados" de un servicio
  //  - gridView: para mostrar la grilla semanal de un servicio
  const [assignedView, setAssignedView] = useState(null);
  const [gridView, setGridView] = useState(null);

  // Cargar la lista de servicios al montar
  useEffect(() => {
    fetchAllServices();
  }, []);

  const fetchAllServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
    }
  };

  // Handlers CRUD
  const handleCreate = () => {
    setSelectedService(null);
    setShowForm(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este servicio?')) {
      await deleteService(id);
      fetchAllServices();
    }
  };

  const handleSave = async (serviceData) => {
    try {
      if (selectedService) {
        // Editar
        await updateService(selectedService.id, serviceData);
      } else {
        // Crear
        await createService(serviceData);
      }
      setShowForm(false);
      setSelectedService(null);
      fetchAllServices();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedService(null);
  };

  // Subvistas:
  const handleOpenAssigned = (service) => {
    setAssignedView(service);
  };
  const handleCloseAssigned = () => {
    setAssignedView(null);
  };

  const handleOpenGrid = (service) => {
    setGridView(service);
  };
  const handleCloseGrid = () => {
    setGridView(null);
  };

  // Render según la vista activa
  if (showForm) {
    // Modo formulario de creación/edición
    return (
      <ServiceForm
        service={selectedService}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  if (assignedView) {
    // Modo "Recursos Asignados"
    return (
      <ServiceAssignedResources
        service={assignedView}
        onClose={handleCloseAssigned}
      />
    );
  }

  if (gridView) {
    // Modo "Grilla Semanal"
    return (
      <ServiceAssignmentGrid
        service={gridView}
        onClose={handleCloseGrid}
      />
    );
  }

  // Vista principal (tabla de servicios)
  return (
    <div>
      <h2>Administrar Servicios</h2>

      <button onClick={handleCreate}>Crear Servicio</button>

      <table border="1" cellPadding="5" style={{ marginTop: '10px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>País</th>
            <th>Descripción</th>
            <th># Oportunidad</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.map((svc) => (
            <tr key={svc.id}>
              <td>{svc.id}</td>
              <td>{svc.client_name}</td>
              <td>{svc.client_country}</td>
              <td>{svc.description}</td>
              <td>{svc.opportunity_number}</td>
              <td>{svc.start_date}</td>
              <td>{svc.end_date}</td>
              <td>
                <button onClick={() => handleEdit(svc)}>Editar</button>
                <button onClick={() => handleDelete(svc.id)}>Eliminar</button>
                <button onClick={() => handleOpenAssigned(svc)}>Recursos Asignados</button>
                <button onClick={() => handleOpenGrid(svc)}>Ver Grilla Semanal</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ServicesList;
