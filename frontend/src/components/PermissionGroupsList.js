import React, { useEffect, useState } from 'react';
import {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup
} from '../services/permissionGroupService';

import GroupModulesManager from './GroupModulesManager';

function PermissionGroupsList() {
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [name, setName] = useState('');

  // Para administrar los módulos de un grupo
  const [modulesGroupId, setModulesGroupId] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const data = await getGroups();
    setGroups(data);
  };

  const handleCreate = () => {
    setName('');
    setSelectedGroup(null);
    setShowForm(true);
  };

  const handleEdit = (grp) => {
    setSelectedGroup(grp);
    setName(grp.name);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este grupo?')) {
      await deleteGroup(id);
      fetchAll();
    }
  };

  const handleSave = async () => {
    if (selectedGroup) {
      await updateGroup(selectedGroup.id, { name });
    } else {
      await createGroup({ name });
    }
    setShowForm(false);
    setSelectedGroup(null);
    fetchAll();
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedGroup(null);
  };

  // Manejo subpantalla para asignar módulos
  const handleOpenModules = (grpId) => {
    setModulesGroupId(grpId);
  };
  const handleCloseModules = () => {
    setModulesGroupId(null);
  };

  return (
    <div>
      <h2>Grupos de Permisos</h2>

      {/* Si no estamos en form ni en modules, botón crear */}
      {!showForm && !modulesGroupId && (
        <button onClick={handleCreate}>Crear Grupo</button>
      )}

      {/* Formulario */}
      {showForm ? (
        <div style={{ marginTop: '10px' }}>
          <label>Nombre del grupo:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleSave}>Guardar</button>
          <button onClick={handleCancel}>Cancelar</button>
        </div>
      ) : modulesGroupId ? (
        // Subpantalla para asignar módulos
        <GroupModulesManager groupId={modulesGroupId} onClose={handleCloseModules} />
      ) : (
        // Tabla principal
        <table border="1" cellPadding="5" style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((grp) => (
              <tr key={grp.id}>
                <td>{grp.id}</td>
                <td>{grp.name}</td>
                <td>
                  <button onClick={() => handleEdit(grp)}>Editar</button>
                  <button onClick={() => handleDelete(grp.id)}>Eliminar</button>
                  <button onClick={() => handleOpenModules(grp.id)}>Administrar Módulos</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PermissionGroupsList;
