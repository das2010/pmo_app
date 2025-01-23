const pool = require('../config/db');

/**
 * Modelo para la tabla "service_assigned_resources" y "service_resource_allocations"
 */
module.exports = {
  // --- ASIGNACIÓN DE RECURSOS A UN SERVICIO (SIN SEMANAS) ---
  
  getAssignedResourcesByService: async (serviceId) => {
    const query = `
      SELECT sar.id, sar.service_id, sar.resource_id,
             r.name as resource_name, r.lastname as resource_lastname,
             s.name as sector_name
      FROM service_assigned_resources sar
      INNER JOIN resources r ON sar.resource_id = r.id
      INNER JOIN sectors s ON r.sector_id = s.id
      WHERE sar.service_id = $1
      ORDER BY s.name, r.name;
    `;
    const { rows } = await pool.query(query, [serviceId]);
    return rows;
  },

  assignResource: async (serviceId, resourceId) => {
    // Insertar en service_assigned_resources
    const query = `
      INSERT INTO service_assigned_resources (service_id, resource_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [serviceId, resourceId]);
    return rows[0];
  },

  unassignResource: async (id) => {
    // Eliminar registro de service_assigned_resources
    const query = `DELETE FROM service_assigned_resources WHERE id = $1;`;
    await pool.query(query, [id]);
    return true;
  },

  // --- HORAS SEMANALES (service_resource_allocations) ---

  getAllocationsByService: async (serviceId) => {
    const query = `
      SELECT sra.id, sra.service_id, sra.resource_id,
             r.name as resource_name, r.lastname as resource_lastname,
             sec.name as sector_name, TO_CHAR(sra.week_date, 'YYYY-MM-DD') as week_date, sra.hours
      FROM service_resource_allocations sra
      INNER JOIN resources r ON sra.resource_id = r.id
      INNER JOIN sectors sec ON r.sector_id = sec.id
      WHERE sra.service_id = $1
      ORDER BY sec.name, r.name, sra.week_date;
    `;
    const { rows } = await pool.query(query, [serviceId]);
    return rows;
  },

  createAllocation: async ({ service_id, resource_id, week_date, hours }) => {
    const query = `
      INSERT INTO service_resource_allocations (service_id, resource_id, week_date, hours)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      service_id,
      resource_id,
      week_date,
      hours || 0,
    ]);
    return rows[0];
  },

  updateAllocation: async (id, { hours }) => {
    const query = `
      UPDATE service_resource_allocations
      SET hours = $1
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [hours, id]);
    return rows[0];
  },

  removeAllocation: async (id) => {
    const query = `DELETE FROM service_resource_allocations WHERE id = $1;`;
    await pool.query(query, [id]);
    return true;
  },
};
