const sectorModel = require('../models/sectorModel');

// Controlador con la lógica de negocio y validaciones
module.exports = {
  getAllSectors: async (req, res) => {
    try {
      const sectors = await sectorModel.getAll();
      return res.json(sectors);
    } catch (error) {
      console.error('Error al obtener sectores:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  createSector: async (req, res) => {
    try {
      const { name, dependency_id } = req.body;

      // Validaciones básicas
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'El campo "name" es obligatorio.' });
      }
      if (name.length > 150) {
        return res.status(400).json({ error: 'El nombre no puede exceder 150 caracteres.' });
      }
      if (dependency_id === null || dependency_id === undefined) {
        // Se permite que sea null únicamente para "Company" (o similares)
        // Si no es el sector "Company", vendrá un valor
      }

      // Validación de "no depender de sí mismo" se haría normalmente
      // en el caso de que existiera un ID. Aquí se hace en update,
      // pero en create no aplica tanto ya que no existe el ID aún.

      const newSector = await sectorModel.create({ name, dependency_id });
      return res.status(201).json(newSector);
    } catch (error) {
      console.error('Error al crear sector:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  updateSector: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, dependency_id } = req.body;

      // Validaciones
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'El campo "name" es obligatorio.' });
      }
      if (name.length > 150) {
        return res.status(400).json({ error: 'El nombre no puede exceder 150 caracteres.' });
      }
      // Validación no depender de sí mismo
      if (parseInt(id, 10) === parseInt(dependency_id, 10)) {
        return res.status(400).json({ error: 'Un sector no puede depender de sí mismo.' });
      }

      const updatedSector = await sectorModel.update(id, { name, dependency_id });
      if (!updatedSector) {
        return res.status(404).json({ error: 'Sector no encontrado.' });
      }
      return res.json(updatedSector);
    } catch (error) {
      console.error('Error al actualizar sector:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  deleteSector: async (req, res) => {
    try {
      const { id } = req.params;
      // Evitar que se elimine "Company" si se desea (validación opcional).
      // Por simplicidad no lo bloqueamos, pero se podría hacer.

      // Eliminar sector
      await sectorModel.remove(id);
      return res.json({ message: 'Sector eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar sector:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};
