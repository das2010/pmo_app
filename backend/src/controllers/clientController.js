const clientModel = require('../models/clientModel');
const clientContactModel = require('../models/clientContactModel');

module.exports = {
  /** CRUD de clientes */
  getAllClients: async (req, res) => {
    try {
      const clients = await clientModel.getAll();
      return res.json(clients);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  createClient: async (req, res) => {
    try {
      const { name, client_code, country } = req.body;

      // Validaciones mínimas
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'El campo "name" es obligatorio.' });
      }
      if (!client_code || client_code.trim() === '') {
        return res.status(400).json({ error: 'El campo "client_code" es obligatorio.' });
      }
      if (client_code.length > 20) {
        return res.status(400).json({ error: 'El client_code no puede exceder 20 caracteres.' });
      }
      const validCountries = ['Argentina', 'Colombia', 'Bolivia', 'Uruguay'];
      if (!validCountries.includes(country)) {
        return res.status(400).json({ error: 'País inválido.' });
      }

      const newClient = await clientModel.create({ name, client_code, country });
      return res.status(201).json(newClient);
    } catch (error) {
      console.error('Error al crear cliente:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  updateClient: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, client_code, country } = req.body;

      // Validaciones mínimas
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'El campo "name" es obligatorio.' });
      }
      if (!client_code || client_code.trim() === '') {
        return res.status(400).json({ error: 'El campo "client_code" es obligatorio.' });
      }
      if (client_code.length > 20) {
        return res.status(400).json({ error: 'El client_code no puede exceder 20 caracteres.' });
      }
      const validCountries = ['Argentina', 'Colombia', 'Bolivia', 'Uruguay'];
      if (!validCountries.includes(country)) {
        return res.status(400).json({ error: 'País inválido.' });
      }

      const updatedClient = await clientModel.update(id, { name, client_code, country });
      if (!updatedClient) {
        return res.status(404).json({ error: 'Cliente no encontrado.' });
      }
      return res.json(updatedClient);
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  deleteClient: async (req, res) => {
    try {
      const { id } = req.params;
      await clientModel.remove(id);
      return res.json({ message: 'Cliente eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  /** CRUD de contactos de un cliente */
  getContactsByClient: async (req, res) => {
    try {
      const { clientId } = req.params;
      const contacts = await clientContactModel.getByClientId(clientId);
      return res.json(contacts);
    } catch (error) {
      console.error('Error al obtener contactos:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  createContact: async (req, res) => {
    try {
      const { client_id, contact_name, phone, email, position } = req.body;

      if (!client_id) {
        return res.status(400).json({ error: 'Falta client_id.' });
      }
      if (!contact_name || contact_name.trim() === '') {
        return res.status(400).json({ error: 'El campo "contact_name" es obligatorio.' });
      }
      if (!phone || phone.trim() === '') {
        return res.status(400).json({ error: 'El campo "phone" es obligatorio.' });
      }
      if (!email || email.trim() === '') {
        return res.status(400).json({ error: 'El campo "email" es obligatorio.' });
      }
      if (!position || position.trim() === '') {
        return res.status(400).json({ error: 'El campo "position" es obligatorio.' });
      }

      const newContact = await clientContactModel.create({
        client_id,
        contact_name,
        phone,
        email,
        position
      });
      return res.status(201).json(newContact);
    } catch (error) {
      console.error('Error al crear contacto:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  updateContact: async (req, res) => {
    try {
      const { id } = req.params;
      const { contact_name, phone, email, position } = req.body;

      if (!contact_name || contact_name.trim() === '') {
        return res.status(400).json({ error: 'El campo "contact_name" es obligatorio.' });
      }
      if (!phone || phone.trim() === '') {
        return res.status(400).json({ error: 'El campo "phone" es obligatorio.' });
      }
      if (!email || email.trim() === '') {
        return res.status(400).json({ error: 'El campo "email" es obligatorio.' });
      }
      if (!position || position.trim() === '') {
        return res.status(400).json({ error: 'El campo "position" es obligatorio.' });
      }

      const updatedContact = await clientContactModel.update(id, {
        contact_name,
        phone,
        email,
        position
      });
      if (!updatedContact) {
        return res.status(404).json({ error: 'Contacto no encontrado.' });
      }
      return res.json(updatedContact);
    } catch (error) {
      console.error('Error al actualizar contacto:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  deleteContact: async (req, res) => {
    try {
      const { id } = req.params;
      await clientContactModel.remove(id);
      return res.json({ message: 'Contacto eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};
