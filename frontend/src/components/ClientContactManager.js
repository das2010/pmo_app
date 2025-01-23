import React, { useEffect, useState } from 'react';
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact
} from '../services/clientService';

function ClientContactManager({ client, onClose }) {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (client) {
      fetchContacts(client.id);
    }
  }, [client]);

  const fetchContacts = async (clientId) => {
    try {
      const data = await getContacts(clientId);
      setContacts(data);
    } catch (error) {
      console.error('Error al obtener contactos:', error);
    }
  };

  const handleCreate = () => {
    setSelectedContact(null);
    setShowForm(true);
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este contacto?')) {
      await deleteContact(id);
      fetchContacts(client.id);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedContact) {
        // Editar
        await updateContact(selectedContact.id, formData);
      } else {
        // Crear
        await createContact(client.id, formData);
      }
      setShowForm(false);
      setSelectedContact(null);
      fetchContacts(client.id);
    } catch (error) {
      console.error('Error al guardar contacto:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedContact(null);
  };

  return (
    <div style={{ marginTop: '20px', border: '1px solid #aaa', padding: '10px' }}>
      <h3>Contactos del Cliente: {client.name}</h3>

      {!showForm && (
        <button onClick={handleCreate}>Agregar Contacto</button>
      )}
      {' '}
      <button onClick={onClose}>Cerrar</button>

      {showForm ? (
        <ContactForm
          contact={selectedContact}
          clientId={client.id}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <table style={{ marginTop: '10px' }} border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((cnt) => (
              <tr key={cnt.id}>
                <td>{cnt.contact_name}</td>
                <td>{cnt.phone}</td>
                <td>{cnt.email}</td>
                <td>{cnt.position}</td>
                <td>
                  <button onClick={() => handleEdit(cnt)}>Editar</button>
                  <button onClick={() => handleDelete(cnt.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/** Pequeño formulario para crear/editar contactos */
function ContactForm({ contact, onSave, onCancel }) {
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');

  useEffect(() => {
    if (contact) {
      setContactName(contact.contact_name);
      setPhone(contact.phone);
      setEmail(contact.email);
      setPosition(contact.position);
    } else {
      setContactName('');
      setPhone('');
      setEmail('');
      setPosition('');
    }
  }, [contact]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      contact_name: contactName,
      phone,
      email,
      position
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
      <div>
        <label>Nombre contacto:</label>
        <input
          type="text"
          value={contactName}
          maxLength={150}
          onChange={(e) => setContactName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Teléfono:</label>
        <input
          type="text"
          value={phone}
          maxLength={50}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          maxLength={150}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Cargo:</label>
        <input
          type="text"
          value={position}
          maxLength={100}
          onChange={(e) => setPosition(e.target.value)}
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

export default ClientContactManager;
