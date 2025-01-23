const pool = require('../config/db');

module.exports = {
  // CRUD de Grupos
  getAllGroups: async () => {
    const query = 'SELECT id, name FROM permission_groups ORDER BY id;';
    const { rows } = await pool.query(query);
    return rows;
  },

  getGroupById: async (id) => {
    const query = 'SELECT id, name FROM permission_groups WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  createGroup: async ({ name }) => {
    const query = `
      INSERT INTO permission_groups (name)
      VALUES ($1)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [name]);
    return rows[0];
  },

  updateGroup: async (id, { name }) => {
    const query = `
      UPDATE permission_groups
      SET name = $1
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [name, id]);
    return rows[0];
  },

  removeGroup: async (id) => {
    const query = 'DELETE FROM permission_groups WHERE id = $1;';
    await pool.query(query, [id]);
    return true;
  },

  // Manejo de la relación group -> modules
  getModulesForGroup: async (groupId) => {
    const query = `
      SELECT m.id, m.name, m.route_path
      FROM permission_group_modules pgm
      INNER JOIN modules m ON pgm.module_id = m.id
      WHERE pgm.group_id = $1
      ORDER BY m.name;
    `;
    const { rows } = await pool.query(query, [groupId]);
    return rows;
  },

  assignModule: async (groupId, moduleId) => {
    const query = `
      INSERT INTO permission_group_modules (group_id, module_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [groupId, moduleId]);
    return rows[0];
  },

  unassignModule: async (id) => {
    const query = `DELETE FROM permission_group_modules WHERE id = $1;`;
    await pool.query(query, [id]);
    return true;
  },

  // Manejo alternativo de unassign por (groupId, moduleId) si prefieres
  unassignModuleByIds: async (groupId, moduleId) => {
    const query = `
      DELETE FROM permission_group_modules
      WHERE group_id = $1 AND module_id = $2
    `;
    await pool.query(query, [groupId, moduleId]);
    return true;
  },
};
