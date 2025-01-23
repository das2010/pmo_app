// pmo-app/backend/src/models/resourceAvailabilityModel.js
const pool = require('../config/db');

/**
 * Función auxiliar para comprobar si existe solapamiento de fechas.
 * Se define fuera del objeto exportado para poder llamarla sin "this".
 */
async function checkOverlap(resourceId, fromDate, toDate, excludeId) {
  let query = `
    SELECT *
    FROM resource_availabilities
    WHERE resource_id = $1
      AND (
        -- Se superpone si "fromDate" cae dentro de un rango ya existente
        (from_date <= $2 AND to_date >= $2)
        -- O si "toDate" cae dentro de un rango existente
        OR (from_date <= $3 AND to_date >= $3)
        -- O si el nuevo rango envuelve totalmente a un rango existente
        OR ($2 <= from_date AND $3 >= from_date)
      )
  `;
  const params = [resourceId, fromDate, toDate];

  if (excludeId) {
    // Para actualización: ignorar el registro actual
    query += ' AND id <> $4';
    params.push(excludeId);
  }

  const { rows } = await pool.query(query, params);
  return rows.length > 0; // True si hay al menos un solapamiento
}

module.exports = {
  /**
   * Obtiene todas las disponibilidades para un recurso dado.
   */
  getByResourceId: async (resourceId) => {
    const query = `
      SELECT id, resource_id, from_date, to_date, daily_hours
      FROM resource_availabilities
      WHERE resource_id = $1
      ORDER BY from_date;
    `;
    const { rows } = await pool.query(query, [resourceId]);
    return rows;
  },

  /**
   * Crea una disponibilidad horaria,
   * validando primero que no se superponga con otra.
   */
  create: async ({ resource_id, from_date, to_date, daily_hours }) => {
    const hasOverlap = await checkOverlap(resource_id, from_date, to_date, null);
    if (hasOverlap) {
      throw new Error('El rango de fechas se solapa con otro período existente.');
    }

    const query = `
      INSERT INTO resource_availabilities (resource_id, from_date, to_date, daily_hours)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      resource_id,
      from_date,
      to_date,
      daily_hours,
    ]);
    return rows[0];
  },

  /**
   * Actualiza una disponibilidad horaria,
   * validando primero que no se superponga con otra.
   */
  update: async (id, { resource_id, from_date, to_date, daily_hours }) => {
    const hasOverlap = await checkOverlap(resource_id, from_date, to_date, id);
    if (hasOverlap) {
      throw new Error('El rango de fechas se solapa con otro período existente.');
    }

    const query = `
      UPDATE resource_availabilities
      SET from_date = $1,
          to_date = $2,
          daily_hours = $3
      WHERE id = $4
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      from_date,
      to_date,
      daily_hours,
      id,
    ]);
    return rows[0];
  },

  /**
   * Elimina un registro de disponibilidad horaria.
   */
  remove: async (id) => {
    const query = `DELETE FROM resource_availabilities WHERE id = $1;`;
    await pool.query(query, [id]);
    return true;
  },
};
