import React, { useState, useEffect } from 'react';

const validCountries = ['Argentina', 'Colombia', 'Bolivia', 'Uruguay'];

function ResourceForm({ resource, sectors, profiles, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [dni, setDni] = useState('');
  const [sectorId, setSectorId] = useState('');
  const [country, setCountry] = useState('Argentina');
  const [profileId, setProfileId] = useState('');

  useEffect(() => {
    if (resource) {
      setName(resource.name);
      setLastname(resource.lastname);
      setDni(resource.dni || '');
      setSectorId(resource.sector_id);
      setCountry(resource.country);
      setProfileId(resource.profile_id);
    } else {
      // Valores iniciales
      setName('');
      setLastname('');
      setDni('');
      setSectorId('');
      setCountry('Argentina');
      setProfileId('');
    }
  }, [resource]);

  // Filtramos los perfiles según el sector seleccionado
  const filteredProfiles = profiles.filter(
    (p) => p.sector_id === Number(sectorId)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      lastname,
      dni,
      sector_id: Number(sectorId),
      country,
      profile_id: Number(profileId),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{resource ? 'Editar Recurso' : 'Crear Recurso'}</h3>

      <div>
        <label>Nombre:</label>
        <input
          type="text"
          value={name}
          maxLength={150}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Apellido:</label>
        <input
          type="text"
          value={lastname}
          maxLength={150}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
      </div>

      <div>
        <label>DNI:</label>
        <input
          type="text"
          value={dni}
          maxLength={20}
          onChange={(e) => setDni(e.target.value)}
        />
      </div>

      <div>
        <label>Sector:</label>
        <select
          value={sectorId}
          onChange={(e) => setSectorId(e.target.value)}
          required
        >
          <option value="">-- Seleccionar --</option>
          {sectors.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>País:</label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        >
          {validCountries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Perfil:</label>
        <select
          value={profileId}
          onChange={(e) => setProfileId(e.target.value)}
          required
        >
          <option value="">-- Seleccionar --</option>
          {filteredProfiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default ResourceForm;
