const pool = require('../config/db');

// Modelo basado en consultas directas a la BD
// Cada función retorna una promesa

module.exports = {
  getAll: async () => {
    const query = `
      SELECT s.id, s.name, s.dependency_id, d.name as dependency_name
      FROM sectors s
      LEFT JOIN sectors d ON s.dependency_id = d.id
      ORDER BY s.id;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  getById: async (id) => {
    const query = `
      SELECT s.id, s.name, s.dependency_id, d.name as dependency_name
      FROM sectors s
      LEFT JOIN sectors d ON s.dependency_id = d.id
      WHERE s.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  create: async ({ name, dependency_id }) => {
    const query = `
      INSERT INTO sectors (name, dependency_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [name, dependency_id || null]);
    return rows[0];
  },

  update: async (id, { name, dependency_id }) => {
    const query = `
      UPDATE sectors
      SET name = $1, dependency_id = $2
      WHERE id = $3
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [name, dependency_id || null, id]);
    return rows[0];
  },

  remove: async (id) => {
    const query = `DELETE FROM sectors WHERE id = $1;`;
    await pool.query(query, [id]);
    return true;
  },
};
