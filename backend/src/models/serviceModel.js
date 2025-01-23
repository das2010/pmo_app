const pool = require('../config/db');

/**
 * Modelo para la tabla "services"
 */
module.exports = {
  // Listar todos los servicios
  getAll: async () => {
    const query = `
      SELECT s.id, s.client_id, c.name as client_name, c.country as client_country,
             s.description, s.opportunity_number,
             s.start_date, s.end_date
      FROM services s
      INNER JOIN clients c ON s.client_id = c.id
      ORDER BY s.id;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener un servicio por ID
  getById: async (id) => {
    const query = `
      SELECT s.id, s.client_id, c.name as client_name, c.country as client_country,
             s.description, s.opportunity_number,
             TO_CHAR(s.start_date, 'YYYY-MM-DD') as start_date, TO_CHAR(s.end_date, 'YYYY-MM-DD') as end_date
      FROM services s
      INNER JOIN clients c ON s.client_id = c.id
      WHERE s.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Crear servicio
  create: async ({ client_id, description, opportunity_number, start_date, end_date }) => {
    const query = `
      INSERT INTO services (client_id, description, opportunity_number, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      client_id,
      description || null,
      opportunity_number || null,
      start_date,
      end_date,
    ]);
    return rows[0];
  },

  // Actualizar servicio
  update: async (id, { client_id, description, opportunity_number, start_date, end_date }) => {
    const query = `
      UPDATE services
      SET client_id = $1,
          description = $2,
          opportunity_number = $3,
          start_date = $4,
          end_date = $5
      WHERE id = $6
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      client_id,
      description || null,
      opportunity_number || null,
      start_date,
      end_date,
      id,
    ]);
    return rows[0];
  },

  // Eliminar servicio
  remove: async (id) => {
    const query = `DELETE FROM services WHERE id = $1;`;
    await pool.query(query, [id]);
    return true;
  },
};
