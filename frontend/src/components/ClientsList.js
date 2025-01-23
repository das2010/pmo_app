import React, { useEffect, useState } from 'react';
import {
  getClients,
  createClient,
  updateClient,
  deleteClient
} from '../services/clientService';

import ClientForm from './ClientForm';
import ClientContactManager from './ClientContactManager';

function ClientsList() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Para mostrar u ocultar la gestión de contactos
  const [contactClient, setContactClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const handleCreate = () => {
    setSelectedClient(null);
    setShowForm(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      await deleteClient(id);
      fetchClients();
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedClient) {
        await updateClient(selectedClient.id, formData);
      } else {
        await createClient(formData);
      }
      setShowForm(false);
      setSelectedClient(null);
      fetchClients();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedClient(null);
  };

  const handleOpenContacts = (client) => {
    setContactClient(client);
  };

  const handleCloseContacts = () => {
    setContactClient(null);
  };

  return (
    <div>
      <h2>Administrar Clientes</h2>
      {!showForm && !contactClient && (
        <button onClick={handleCreate}>Crear Cliente</button>
      )}

      {showForm && (
        <ClientForm
          client={selectedClient}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {!showForm && !contactClient && (
        <table border="1" cellPadding="5" style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cliente Code</th>
              <th>País</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.client_code}</td>
                <td>{c.country}</td>
                <td>
                  <button onClick={() => handleEdit(c)}>Editar</button>
                  <button onClick={() => handleDelete(c.id)}>Eliminar</button>
                  <button onClick={() => handleOpenContacts(c)}>
                    Contactos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {contactClient && (
        <ClientContactManager
          client={contactClient}
          onClose={handleCloseContacts}
        />
      )}
    </div>
  );
}

export default ClientsList;
