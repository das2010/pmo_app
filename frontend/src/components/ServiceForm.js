import React, { useState, useEffect } from 'react';
import { getClients } from '../services/clientService';

const validCountries = ['Argentina', 'Colombia', 'Bolivia', 'Uruguay'];

function ServiceForm({ service, onSave, onCancel }) {
  const [clients, setClients] = useState([]);

  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [opportunityNumber, setOpportunityNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (service) {
      setClientId(service.client_id);
      setDescription(service.description || '');
      setOpportunityNumber(service.opportunity_number || '');
      setStartDate(service.start_date?.split('T')[0] || '');
      setEndDate(service.end_date?.split('T')[0] || ''); 
    } else { 
      setClientId('');
      setDescription('');
      setOpportunityNumber('');
      setStartDate('');
      setEndDate('');
    }
  }, [service]);

  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      client_id: Number(clientId),
      description,
      opportunity_number: opportunityNumber,
      start_date: startDate,
      end_date: endDate,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{service ? 'Editar Servicio' : 'Crear Servicio'}</h3>

      <div>
        <label>Cliente:</label>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
        >
          <option value="">-- Seleccionar --</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} - {c.country}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Descripción:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label>Número de Oportunidad (max 15):</label>
        <input
          type="text"
          value={opportunityNumber}
          maxLength={15}
          onChange={(e) => setOpportunityNumber(e.target.value)}
        />
      </div>

      <div>
        <label>Fecha Inicio:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Fecha Fin:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
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

export default ServiceForm;
