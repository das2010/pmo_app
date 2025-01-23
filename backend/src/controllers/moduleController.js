const moduleModel = require('../models/moduleModel');

/**
 * Controlador para la tabla "modules"
 * con métodos para getAll, create, update, delete.
 */
module.exports = {
  // GET /api/modules
  getAll: async (req, res) => {
    try {
      const data = await moduleModel.getAllModules();
      return res.json(data);
    } catch (error) {
      console.error('Error al obtener módulos:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // GET /api/modules/:id
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const mod = await moduleModel.getModuleById(id);
      if (!mod) {
        return res.status(404).json({ error: 'Módulo no encontrado.' });
      }
      return res.json(mod);
    } catch (error) {
      console.error('Error al obtener módulo por ID:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // POST /api/modules
  create: async (req, res) => {
    try {
      const { name, route_path } = req.body;
      if (!name || !route_path) {
        return res.status(400).json({ error: 'Faltan campos (name, route_path).' });
      }
      const newModule = await moduleModel.createModule({ name, route_path });
      return res.status(201).json(newModule);
    } catch (error) {
      console.error('Error al crear módulo:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // PUT /api/modules/:id
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, route_path } = req.body;
      if (!name || !route_path) {
        return res.status(400).json({ error: 'Faltan campos (name, route_path).' });
      }
      const updated = await moduleModel.updateModule(id, { name, route_path });
      if (!updated) {
        return res.status(404).json({ error: 'Módulo no encontrado.' });
      }
      return res.json(updated);
    } catch (error) {
      console.error('Error al actualizar módulo:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // DELETE /api/modules/:id
  remove: async (req, res) => {
    try {
      const { id } = req.params;
      await moduleModel.removeModule(id);
      return res.json({ message: 'Módulo eliminado.' });
    } catch (error) {
      console.error('Error al eliminar módulo:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};
