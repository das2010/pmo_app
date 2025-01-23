import React, { useEffect, useState } from 'react';
import { getProfiles, createProfile, updateProfile, deleteProfile } from '../services/profileService';
import { getSectors } from '../services/sectorService'; // Para mostrar lista de sectores
import ProfileForm from './ProfileForm';

function ProfilesList() {
  const [profiles, setProfiles] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProfiles = async () => {
    try {
      const data = await getProfiles();
      setProfiles(data);
    } catch (error) {
      console.error('Error al obtener los perfiles:', error);
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

  useEffect(() => {
    fetchProfiles();
    fetchSectors();
  }, []);

  const handleCreate = () => {
    setSelectedProfile(null);
    setShowForm(true);
  };

  const handleEdit = (profile) => {
    setSelectedProfile(profile);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este perfil?')) {
      await deleteProfile(id);
      fetchProfiles();
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedProfile) {
        // Editar
        await updateProfile(selectedProfile.id, formData);
      } else {
        // Crear
        await createProfile(formData);
      }
      setShowForm(false);
      setSelectedProfile(null);
      fetchProfiles();
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedProfile(null);
  };

  return (
    <div>
      <h2>Administrar Perfiles</h2>
      {!showForm && (
        <button onClick={handleCreate}>Crear Perfil</button>
      )}

      {showForm ? (
        <ProfileForm
          profile={selectedProfile}
          sectors={sectors}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <table border="1" cellPadding="5" style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Sector</th>
              <th>Nivel</th>
              <th>Factor Conversión</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td>{profile.id}</td>
                <td>{profile.name}</td>
                <td>{profile.sector_name}</td>
                <td>{profile.level}</td>
                <td>{profile.conversion_factor}</td>
                <td>
                  <button onClick={() => handleEdit(profile)}>Editar</button>
                  <button onClick={() => handleDelete(profile.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProfilesList;
