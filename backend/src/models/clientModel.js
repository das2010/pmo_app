const pool = require('../config/db');

module.exports = {
  // CRUD tabla "clients"

  // Obtener todos los clientes
  getAll: async () => {
    const query = `
      SELECT id, name, client_code, country
      FROM clients
      ORDER BY id;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener cliente por ID
  getById: async (id) => {
    const query = `
      SELECT id, name, client_code, country
      FROM clients
      WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Crear cliente
  create: async ({ name, client_code, country }) => {
    const query = `
      INSERT INTO clients (name, client_code, country)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [name, client_code, country]);
    return rows[0];
  },

  // Actualizar cliente
  update: async (id, { name, client_code, country }) => {
    const query = `
      UPDATE clients
      SET name = $1,
          client_code = $2,
          country = $3
      WHERE id = $4
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [name, client_code, country, id]);
    return rows[0];
  },

  // Eliminar cliente
  remove: async (id) => {
    const query = `DELETE FROM clients WHERE id = $1;`;
    await pool.query(query, [id]);
    return true;
  },
};
