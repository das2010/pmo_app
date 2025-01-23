const pool = require('../config/db');

module.exports = {
  // Manejo de la tabla "client_contacts"

  // Obtener contactos de un cliente
  getByClientId: async (clientId) => {
    const query = `
      SELECT id, client_id, contact_name, phone, email, position
      FROM client_contacts
      WHERE client_id = $1
      ORDER BY id;
    `;
    const { rows } = await pool.query(query, [clientId]);
    return rows;
  },

  // Crear contacto
  create: async ({ client_id, contact_name, phone, email, position }) => {
    const query = `
      INSERT INTO client_contacts (client_id, contact_name, phone, email, position)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      client_id,
      contact_name,
      phone,
      email,
      position
    ]);
    return rows[0];
  },

  // Actualizar contacto
  update: async (id, { contact_name, phone, email, position }) => {
    const query = `
      UPDATE client_contacts
      SET contact_name = $1,
          phone = $2,
          email = $3,
          position = $4
      WHERE id = $5
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      contact_name,
      phone,
      email,
      position,
      id
    ]);
    return rows[0];
  },

  // Eliminar contacto
  remove: async (id) => {
    const query = `DELETE FROM client_contacts WHERE id = $1;`;
    await pool.query(query, [id]);
    return true;
  },
};
