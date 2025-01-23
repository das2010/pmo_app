import React, { useEffect, useState } from 'react';
import { getAssignedResources, assignResource, unassignResource } from '../services/serviceService';
import { getSectors } from '../services/sectorService';
import { getResources } from '../services/resourceService';

function ServiceAssignedResources({ service, onClose }) {
  // Lista de recursos asignados
  const [assignedList, setAssignedList] = useState([]);

  // Para asignar un nuevo recurso, necesitamos sector y recurso
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState('');
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState('');

  useEffect(() => {
    fetchAssignedResources();
    fetchSectors();
    fetchAllResources();
  }, []);

  const fetchAssignedResources = async () => {
    try {
      const data = await getAssignedResources(service.id);
      setAssignedList(data);
    } catch (error) {
      console.error('Error al obtener recursos asignados:', error);
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

  const fetchAllResources = async () => {
    try {
      const data = await getResources();
      setResources(data);
    } catch (error) {
      console.error('Error al obtener recursos:', error);
    }
  };

  // Filtrar recursos por sector
  useEffect(() => {
    if (selectedSector) {
      setFilteredResources(resources.filter(r => r.sector_id === Number(selectedSector)));
    } else {
      setFilteredResources([]);
    }
    setSelectedResource('');
  }, [selectedSector, resources]);

  const handleAssign = async () => {
    if (!selectedResource) return;
    try {
      const res = await assignResource(service.id, Number(selectedResource));
      // Actualizar la lista
      fetchAssignedResources();
    } catch (error) {
      console.error('Error al asignar recurso:', error);
    }
  };

  const handleUnassign = async (assignedId) => {
    if (window.confirm('¿Quitar este recurso asignado?')) {
      try {
        await unassignResource(assignedId);
        fetchAssignedResources();
      } catch (error) {
        console.error('Error al desasignar recurso:', error);
      }
    }
  };

  return (
    <div>
      <h3>Recursos Asignados a: {service.description || 'Servicio'}</h3>
      <button onClick={onClose}>Cerrar</button>

      <div style={{ border: '1px solid #aaa', padding: '10px', marginTop: '10px' }}>
        <h4>Asignar nuevo recurso</h4>
        <div>
          <label>Sector:</label>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {sectors.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <label style={{ marginLeft: '10px' }}>Recurso:</label>
          <select
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {filteredResources.map(r => (
              <option key={r.id} value={r.id}>{r.name} {r.lastname}</option>
            ))}
          </select>

          <button onClick={handleAssign} style={{ marginLeft: '10px' }}>
            Asignar
          </button>
        </div>
      </div>

      <table border="1" cellPadding="5" style={{ marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Sector</th>
            <th>Recurso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {assignedList.map((a) => (
            <tr key={a.id}>
              <td>{a.sector_name}</td>
              <td>{a.resource_name} {a.resource_lastname}</td>
              <td>
                <button onClick={() => handleUnassign(a.id)}>Quitar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ServiceAssignedResources;
