const pool = require('../config/db');

module.exports = {
  // CRUD de la tabla resources

  // Obtener todos los recursos
  getAll: async () => {
    const query = `
      SELECT r.id, r.name, r.lastname, r.dni, r.sector_id, r.country, r.profile_id,
             s.name AS sector_name,
             p.name AS profile_name
      FROM resources r
      INNER JOIN sectors s ON r.sector_id = s.id
      INNER JOIN profiles p ON r.profile_id = p.id
      ORDER BY r.id;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener un recurso por su ID
  getById: async (id) => {
    const query = `
      SELECT r.id, r.name, r.lastname, r.dni, r.sector_id, r.country, r.profile_id,
             s.name AS sector_name,
             p.name AS profile_name
      FROM resources r
      INNER JOIN sectors s ON r.sector_id = s.id
      INNER JOIN profiles p ON r.profile_id = p.id
      WHERE r.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Crear un recurso
  create: async ({ name, lastname, dni, sector_id, country, profile_id }) => {
    const query = `
      INSERT INTO resources (name, lastname, dni, sector_id, country, profile_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      name,
      lastname,
      dni || null,
      sector_id,
      country,
      profile_id
    ]);
    return rows[0];
  },

  // Actualizar un recurso
  update: async (id, { name, lastname, dni, sector_id, country, profile_id }) => {
    const query = `
      UPDATE resources
      SET name = $1,
          lastname = $2,
          dni = $3,
          sector_id = $4,
          country = $5,
          profile_id = $6
      WHERE id = $7
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      name,
      lastname,
      dni || null,
      sector_id,
      country,
      profile_id,
      id
    ]);
    return rows[0];
  },

  // Eliminar un recurso
  remove: async (id) => {
    const query = `DELETE FROM resources WHERE id = $1;`;
    await pool.query(query, [id]);
    return true;
  },
};
