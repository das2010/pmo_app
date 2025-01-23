import React, { useState, useEffect } from 'react';

function ProfileForm({ profile, sectors, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [sectorId, setSectorId] = useState('');
  const [level, setLevel] = useState(0);
  const [conversionFactor, setConversionFactor] = useState(1);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setSectorId(profile.sector_id);
      setLevel(profile.level);
      setConversionFactor(profile.conversion_factor);
    } else {
      // Valores iniciales
      setName('');
      setSectorId('');
      setLevel(0);
      setConversionFactor(1);
    }
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      sector_id: Number(sectorId),
      level: Number(level),
      conversion_factor: Number(conversionFactor)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre del perfil:</label>
        <input
          type="text"
          value={name}
          maxLength={150}
          onChange={(e) => setName(e.target.value)}
          required
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
        <label>Nivel (0 a 5):</label>
        <input
          type="number"
          min="0"
          max="5"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Factor de Conversión (0 a 1):</label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={conversionFactor}
          onChange={(e) => setConversionFactor(e.target.value)}
          required
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

export default ProfileForm;
