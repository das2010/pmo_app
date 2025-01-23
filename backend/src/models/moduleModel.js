const pool = require('../config/db');

/**
 * Modelo para la tabla "modules"
 * con métodos CRUD: getAll, getById, create, update, remove.
 */
module.exports = {
  // Listar todos los módulos
  getAllModules: async () => {
    const query = `
      SELECT id, name, route_path
      FROM modules
      ORDER BY id;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener un módulo por ID
  getModuleById: async (id) => {
    const query = `
      SELECT id, name, route_path
      FROM modules
      WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Crear un nuevo módulo
  createModule: async ({ name, route_path }) => {
    const query = `
      INSERT INTO modules (name, route_path)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [name, route_path]);
    return rows[0];
  },

  // Actualizar un módulo existente
  updateModule: async (id, { name, route_path }) => {
    const query = `
      UPDATE modules
      SET name = $1, route_path = $2
      WHERE id = $3
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [name, route_path, id]);
    return rows[0];
  },

  // Eliminar un módulo
  removeModule: async (id) => {
    const query = `
      DELETE FROM modules
      WHERE id = $1;
    `;
    await pool.query(query, [id]);
    return true;
  },
};
