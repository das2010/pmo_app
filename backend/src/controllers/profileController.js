const profileModel = require('../models/profileModel');

module.exports = {
  getAllProfiles: async (req, res) => {
    try {
      const profiles = await profileModel.getAll();
      return res.json(profiles);
    } catch (error) {
      console.error('Error al obtener perfiles:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  createProfile: async (req, res) => {
    try {
      const { name, sector_id, level, conversion_factor } = req.body;

      // Validaciones mínimas
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'El campo "name" es obligatorio.' });
      }
      if (name.length > 150) {
        return res.status(400).json({ error: 'El nombre no puede exceder 150 caracteres.' });
      }

      if (typeof sector_id !== 'number') {
        return res.status(400).json({ error: 'El campo "sector_id" debe ser numérico.' });
      }

      if (level < 0 || level > 5) {
        return res.status(400).json({ error: 'El nivel debe estar entre 0 y 5.' });
      }

      if (conversion_factor < 0 || conversion_factor > 1) {
        return res.status(400).json({ error: 'El factor de conversión debe estar entre 0 y 1.' });
      }

      const newProfile = await profileModel.create({ name, sector_id, level, conversion_factor });
      return res.status(201).json(newProfile);
    } catch (error) {
      console.error('Error al crear perfil:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, sector_id, level, conversion_factor } = req.body;

      // Validaciones
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'El campo "name" es obligatorio.' });
      }
      if (name.length > 150) {
        return res.status(400).json({ error: 'El nombre no puede exceder 150 caracteres.' });
      }
      if (typeof sector_id !== 'number') {
        return res.status(400).json({ error: 'El campo "sector_id" debe ser numérico.' });
      }
      if (level < 0 || level > 5) {
        return res.status(400).json({ error: 'El nivel debe estar entre 0 y 5.' });
      }
      if (conversion_factor < 0 || conversion_factor > 1) {
        return res.status(400).json({ error: 'El factor de conversión debe estar entre 0 y 1.' });
      }

      const updatedProfile = await profileModel.update(id, {
        name,
        sector_id,
        level,
        conversion_factor,
      });
      if (!updatedProfile) {
        return res.status(404).json({ error: 'Perfil no encontrado.' });
      }
      return res.json(updatedProfile);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  deleteProfile: async (req, res) => {
    try {
      const { id } = req.params;
      await profileModel.remove(id);
      return res.json({ message: 'Perfil eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar perfil:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};
