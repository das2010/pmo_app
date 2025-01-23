const pool = require('../config/db');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const bcrypt = require('bcrypt'); // para encriptar contraseñas

module.exports = {
  // CRUD de Usuarios
  getAllUsers: async () => {
    const query = `
      SELECT u.id, u.username, u.group_id, pg.name as group_name
      FROM users u
      INNER JOIN permission_groups pg ON u.group_id = pg.id
      ORDER BY u.id;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  getUserById: async (id) => {
    const query = `
      SELECT u.id, u.username, u.group_id, pg.name as group_name
      FROM users u
      INNER JOIN permission_groups pg ON u.group_id = pg.id
      WHERE u.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  createUser: async ({ username, password, group_id }) => {
    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (username, password, group_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [username, hashedPass, group_id]);
    return rows[0];
  },

  updateUser: async (id, { username, password, group_id }) => {
    // Determinar si actualiza el password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }
    const query = `
      UPDATE users
      SET username = $1,
          ${password ? 'password = $2,' : ''}
          group_id = $3
      WHERE id = $4
      RETURNING *;
    `;
    if (password) {
      const { rows } = await pool.query(query, [username, password, group_id, id]);
      return rows[0];
    } else {
      // sin actualizar pass
      const queryNoPass = `
        UPDATE users
        SET username = $1,
            group_id = $2
        WHERE id = $3
        RETURNING *;
      `;
      const { rows } = await pool.query(queryNoPass, [username, group_id, id]);
      return rows[0];
    }
  },

  // Autenticar usuario
  authUser: async (username, plainPassword) => {
    const query = `
      SELECT u.id, u.username, u.password,
             u.group_id, pg.name as group_name
      FROM users u
      INNER JOIN permission_groups pg ON u.group_id = pg.id
      WHERE u.username = $1
    `;
    const { rows } = await pool.query(query, [username]);
    if (rows.length === 0) {
      return null; // no existe user
    }

    const user = rows[0];
    // Comparamos contraseñas
    const match = await bcrypt.compare(plainPassword, user.password);
    if (!match) {
      return null;
    }
    // Devolver user sin el campo password
    return {
      id: user.id,
      username: user.username,
      group_id: user.group_id,
      group_name: user.group_name,
    };
  },

  removeUser: async (id) => {
    const query = 'DELETE FROM users WHERE id = $1;';
    await pool.query(query, [id]);
    return true;
  }
};
