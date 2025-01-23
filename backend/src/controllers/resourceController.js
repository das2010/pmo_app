const resourceModel = require('../models/resourceModel');
const resourceAvailabilityModel = require('../models/resourceAvailabilityModel');

module.exports = {
  /* CRUD de Recursos */

  getAllResources: async (req, res) => {
    try {
      const resources = await resourceModel.getAll();
      return res.json(resources);
    } catch (error) {
      console.error('Error al obtener recursos:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  createResource: async (req, res) => {
    try {
      const { name, lastname, dni, sector_id, country, profile_id } = req.body;

      // Validaciones mínimas
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'El campo "name" es obligatorio.' });
      }
      if (!lastname || lastname.trim() === '') {
        return res.status(400).json({ error: 'El campo "lastname" es obligatorio.' });
      }
      if (!sector_id) {
        return res.status(400).json({ error: 'El campo "sector_id" es obligatorio.' });
      }
      if (!profile_id) {
        return res.status(400).json({ error: 'El campo "profile_id" es obligatorio.' });
      }
      // Validar country
      const validCountries = ['Argentina', 'Colombia', 'Bolivia', 'Uruguay'];
      if (!validCountries.includes(country)) {
        return res.status(400).json({ error: 'País inválido.' });
      }
      if (dni && dni.length > 20) {
        return res.status(400).json({ error: 'El DNI no puede exceder 20 caracteres.' });
      }

      const newResource = await resourceModel.create({
        name,
        lastname,
        dni,
        sector_id,
        country,
        profile_id,
      });

      return res.status(201).json(newResource);
    } catch (error) {
      console.error('Error al crear recurso:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  updateResource: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, lastname, dni, sector_id, country, profile_id } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'El campo "name" es obligatorio.' });
      }
      if (!lastname || lastname.trim() === '') {
        return res.status(400).json({ error: 'El campo "lastname" es obligatorio.' });
      }
      const validCountries = ['Argentina', 'Colombia', 'Bolivia', 'Uruguay'];
      if (!validCountries.includes(country)) {
        return res.status(400).json({ error: 'País inválido.' });
      }
      if (dni && dni.length > 20) {
        return res.status(400).json({ error: 'El DNI no puede exceder 20 caracteres.' });
      }

      const updatedResource = await resourceModel.update(id, {
        name,
        lastname,
        dni,
        sector_id,
        country,
        profile_id,
      });
      if (!updatedResource) {
        return res.status(404).json({ error: 'Recurso no encontrado.' });
      }
      return res.json(updatedResource);
    } catch (error) {
      console.error('Error al actualizar recurso:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  deleteResource: async (req, res) => {
    try {
      const { id } = req.params;
      await resourceModel.remove(id);
      return res.json({ message: 'Recurso eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar recurso:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  /* CRUD de Disponibilidad (resource_availabilities) */

  getAvailabilitiesByResource: async (req, res) => {
    try {
      const { resourceId } = req.params;
      const availabilities = await resourceAvailabilityModel.getByResourceId(resourceId);
      return res.json(availabilities);
    } catch (error) {
      console.error('Error al obtener disponibilidades:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  createAvailability: async (req, res) => {
    try {
      const { resource_id, from_date, to_date, daily_hours } = req.body;

      if (!resource_id) {
        return res.status(400).json({ error: 'Falta resource_id.' });
      }
      if (!from_date || !to_date) {
        return res.status(400).json({ error: 'Faltan campos de fecha.' });
      }
      if (daily_hours < 0) {
        return res.status(400).json({ error: 'Las horas diarias no pueden ser negativas.' });
      }

      const newAvailability = await resourceAvailabilityModel.create({
        resource_id,
        from_date,
        to_date,
        daily_hours,
      });
      return res.status(201).json(newAvailability);
    } catch (error) {
      console.error('Error al crear disponibilidad:', error);
      // Si viene de throw new Error('...') en el model:
      return res.status(400).json({ error: error.message || 'Error interno' });
    }
  },

  updateAvailability: async (req, res) => {
    try {
      const { id } = req.params;
      const { resource_id, from_date, to_date, daily_hours } = req.body;

      if (!from_date || !to_date) {
        return res.status(400).json({ error: 'Faltan campos de fecha.' });
      }
      if (daily_hours < 0) {
        return res.status(400).json({ error: 'Las horas diarias no pueden ser negativas.' });
      }

      const updatedAvailability = await resourceAvailabilityModel.update(id, {
        resource_id,
        from_date,
        to_date,
        daily_hours,
      });
      if (!updatedAvailability) {
        return res.status(404).json({ error: 'Registro de disponibilidad no encontrado.' });
      }
      return res.json(updatedAvailability);
    } catch (error) {
      console.error('Error al actualizar disponibilidad:', error);
      return res.status(400).json({ error: error.message || 'Error interno' });
    }
  },

  deleteAvailability: async (req, res) => {
    try {
      const { id } = req.params;
      await resourceAvailabilityModel.remove(id);
      return res.json({ message: 'Disponibilidad eliminada correctamente.' });
    } catch (error) {
      console.error('Error al eliminar disponibilidad:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};
