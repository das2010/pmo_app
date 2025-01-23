const pool = require('../config/db');

// Modelo para la tabla "profiles"
module.exports = {
  getAll: async () => {
    const query = `
      SELECT p.id, p.name, p.sector_id, p.level, p.conversion_factor,
             s.name AS sector_name
      FROM profiles p
      INNER JOIN sectors s ON p.sector_id = s.id
      ORDER BY p.id;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  getById: async (id) => {
    const query = `
      SELECT p.id, p.name, p.sector_id, p.level, p.conversion_factor,
             s.name AS sector_name
      FROM profiles p
      INNER JOIN sectors s ON p.sector_id = s.id
      WHERE p.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  create: async ({ name, sector_id, level, conversion_factor }) => {
    const query = `
      INSERT INTO profiles (name, sector_id, level, conversion_factor)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      name,
      sector_id,
      level,
      conversion_factor
    ]);
    return rows[0];
  },

  update: async (id, { name, sector_id, level, conversion_factor }) => {
    const query = `
      UPDATE profiles
      SET name = $1,
          sector_id = $2,
          level = $3,
          conversion_factor = $4
      WHERE id = $5
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      name,
      sector_id,
      level,
      conversion_factor,
      id
    ]);
    return rows[0];
  },

  remove: async (id) => {
    const query = `DELETE FROM profiles WHERE id = $1;`;
    await pool.query(query, [id]);
    return true;
  },
};
