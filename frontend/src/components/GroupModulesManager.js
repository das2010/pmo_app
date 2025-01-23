// frontend/src/components/GroupModulesManager.js

import React, { useEffect, useState } from 'react';
import {
  getAllModules,  // si lo tienes en un moduleService
} from '../services/moduleService'; // o define en permissionGroupService
import {
  getModulesByGroup,
  assignModuleToGroup,
  unassignModuleFromGroup
} from '../services/permissionGroupService';

function GroupModulesManager({ groupId, onClose }) {
  const [allModules, setAllModules] = useState([]);
  const [assignedModules, setAssignedModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');

  useEffect(() => {
    fetchAllModules();
    fetchAssignedModules();
  }, [groupId]);

  const fetchAllModules = async () => {
    try {
      const data = await getAllModules();
      setAllModules(data);
    } catch (error) {
      console.error('Error al obtener todos los módulos:', error);
    }
  };

  const fetchAssignedModules = async () => {
    try {
      const data = await getModulesByGroup(groupId);
      setAssignedModules(data);
    } catch (error) {
      console.error('Error al obtener módulos asignados:', error);
    }
  };

  // Filtrar módulos que NO estén asignados
  const availableModules = allModules.filter(
    (m) => !assignedModules.some((am) => am.id === m.id)
  );

  const handleAssign = async () => {
    if (!selectedModule) return;
    try {
      await assignModuleToGroup(groupId, Number(selectedModule));
      fetchAssignedModules();
    } catch (error) {
      console.error('Error al asignar módulo:', error);
    }
  };

  const handleUnassign = async (moduleId) => {
    if (window.confirm('¿Quitar este módulo?')) {
      try {
        await unassignModuleFromGroup(groupId, moduleId);
        fetchAssignedModules();
      } catch (error) {
        console.error('Error al quitar módulo:', error);
      }
    }
  };

  return (
    <div>
      <h3>Administrar Módulos del Grupo #{groupId}</h3>
      <button onClick={onClose}>Cerrar</button>

      <div style={{ marginTop: '10px', border: '1px solid #ccc', padding: '10px' }}>
        <h4>Asignar Módulo</h4>
        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          {availableModules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.route_path})
            </option>
          ))}
        </select>
        <button onClick={handleAssign} style={{ marginLeft: '10px' }}>Asignar</button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <h4>Módulos asignados al grupo:</h4>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Módulo</th>
              <th>Ruta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {assignedModules.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.route_path}</td>
                <td>
                  <button onClick={() => handleUnassign(m.id)}>Quitar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GroupModulesManager;
