const permissionGroupModel = require('../models/permissionGroupModel');

module.exports = {
  // CRUD de Grupos
  getAllGroups: async (req, res) => {
    try {
      const groups = await permissionGroupModel.getAllGroups();
      return res.json(groups);
    } catch (error) {
      console.error('Error al obtener grupos:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  createGroup: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'El campo "name" es obligatorio.' });
      }
      const newGroup = await permissionGroupModel.createGroup({ name });
      return res.status(201).json(newGroup);
    } catch (error) {
      console.error('Error al crear grupo:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  updateGroup: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'El campo "name" es obligatorio.' });
      }
      const updatedGroup = await permissionGroupModel.updateGroup(id, { name });
      if (!updatedGroup) {
        return res.status(404).json({ error: 'Grupo no encontrado.' });
      }
      return res.json(updatedGroup);
    } catch (error) {
      console.error('Error al actualizar grupo:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  deleteGroup: async (req, res) => {
    try {
      const { id } = req.params;
      await permissionGroupModel.removeGroup(id);
      return res.json({ message: 'Grupo eliminado.' });
    } catch (error) {
      console.error('Error al eliminar grupo:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Manejo de modules asignados
  getModulesByGroup: async (req, res) => {
    try {
      const { groupId } = req.params;
      const modules = await permissionGroupModel.getModulesForGroup(groupId);
      return res.json(modules);
    } catch (error) {
      console.error('Error al obtener módulos del grupo:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  assignModule: async (req, res) => {
    try {
      const { groupId } = req.params;
      const { module_id } = req.body;
      if (!module_id) {
        return res.status(400).json({ error: 'Falta module_id.' });
      }
      const assigned = await permissionGroupModel.assignModule(groupId, module_id);
      return res.status(201).json(assigned);
    } catch (error) {
      console.error('Error al asignar módulo al grupo:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  unassignModule: async (req, res) => {
    try {
      const { groupId, moduleId } = req.params;
      // Podrías hacerlo por ID en permission_group_modules,
      // pero aquí lo hacemos por (groupId, moduleId)
      await permissionGroupModel.unassignModuleByIds(groupId, moduleId);
      return res.json({ message: 'Módulo desasignado del grupo.' });
    } catch (error) {
      console.error('Error al desasignar módulo:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};
