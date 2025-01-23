import React, { useState, useEffect } from 'react';

const validCountries = ['Argentina', 'Colombia', 'Bolivia', 'Uruguay'];

function ClientForm({ client, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [clientCode, setClientCode] = useState('');
  const [country, setCountry] = useState('Argentina');

  useEffect(() => {
    if (client) {
      setName(client.name);
      setClientCode(client.client_code);
      setCountry(client.country);
    } else {
      setName('');
      setClientCode('');
      setCountry('Argentina');
    }
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      client_code: clientCode,
      country
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{client ? 'Editar Cliente' : 'Crear Cliente'}</h3>

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
        <label>ID/Code (alfanum.):</label>
        <input
          type="text"
          value={clientCode}
          maxLength={20}
          onChange={(e) => setClientCode(e.target.value)}
          required
        />
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

      <div style={{ marginTop: '10px' }}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default ClientForm;
