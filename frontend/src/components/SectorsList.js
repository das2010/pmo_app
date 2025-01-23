import React, { useEffect, useState } from 'react';
import { getSectors, createSector, updateSector, deleteSector } from '../services/sectorService';
import SectorForm from './SectorForm';
import SectorsTree from './SectorsTree'; // <-- Import

function SectorsList() {
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // NUEVO: estado para vista en árbol
  const [showTree, setShowTree] = useState(false);

  const fetchSectors = async () => {
    try {
      const data = await getSectors();
      setSectors(data);
    } catch (error) {
      console.error('Error al obtener los sectores:', error);
    }
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  const handleCreate = () => {
    setSelectedSector(null);
    setShowForm(true);
  };

  const handleEdit = (sector) => {
    setSelectedSector(sector);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este sector?')) {
      await deleteSector(id);
      fetchSectors();
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedSector) {
        await updateSector(selectedSector.id, formData);
      } else {
        await createSector(formData);
      }
      setShowForm(false);
      setSelectedSector(null);
      fetchSectors();
    } catch (error) {
      console.error('Error al guardar el sector:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedSector(null);
  };

  // Alternar la vista entre Tabla y Árbol
  const toggleTreeView = () => {
    setShowTree(!showTree);
  };

  return (
    <div>
      <h2>Administrar Sectores</h2>

      {/* Si no mostramos el formulario, mostramos los botones */}
      {!showForm && (
        <div style={{ marginBottom: '10px' }}>
          <button onClick={handleCreate}>Crear Sector</button>
          {' '}
          <button onClick={toggleTreeView}>
            {showTree ? 'Volver a la Tabla' : 'Ver Árbol'}
          </button>
        </div>
      )}

      {showForm ? (
        <SectorForm
          sector={selectedSector}
          sectors={sectors}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : showTree ? (
        <SectorsTree sectors={sectors} />
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dependencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sectors.map((sec) => (
              <tr key={sec.id}>
                <td>{sec.id}</td>
                <td>{sec.name}</td>
                <td>{sec.dependency_name || 'Ninguno'}</td>
                <td>
                  <button onClick={() => handleEdit(sec)}>Editar</button>
                  <button onClick={() => handleDelete(sec.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SectorsList;
