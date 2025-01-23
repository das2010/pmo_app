import React, { useState, useEffect } from 'react';

function SectorForm({ sector, sectors, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [dependencyId, setDependencyId] = useState(null);

  useEffect(() => {
    if (sector) {
      setName(sector.name);
      setDependencyId(sector.dependency_id);
    } else {
      setName('');
      setDependencyId(null);
    }
  }, [sector]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Llamamos a onSave con la data del formulario
    onSave({
      name,
      dependency_id: dependencyId || null
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre del sector:</label>
        <input
          type="text"
          value={name}
          maxLength={150}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Dependencia:</label>
        <select
          value={dependencyId || ''}
          onChange={(e) => setDependencyId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">-- Sin dependencia --</option>
          {sectors
            .filter((s) => !sector || s.id !== sector.id) // Evita que se asigne a sí mismo
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

export default SectorForm;
