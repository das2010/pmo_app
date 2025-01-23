const userModel = require('../models/userModel');

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      return res.json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  createUser: async (req, res) => {
    try {
      const { username, password, group_id } = req.body;
      if (!username || !password || !group_id) {
        return res.status(400).json({ error: 'Faltan campos (username, password, group_id).' });
      }
      const newUser = await userModel.createUser({ username, password, group_id });
      return res.status(201).json(newUser);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password, group_id } = req.body;
      if (!username || !group_id) {
        return res.status(400).json({ error: 'Faltan campos (username, group_id).' });
      }
      const updatedUser = await userModel.updateUser(id, { username, password, group_id });
      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
      return res.json(updatedUser);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      await userModel.removeUser(id);
      return res.json({ message: 'Usuario eliminado.' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};
