// pmo-app/backend/src/controllers/serviceController.js

const serviceModel = require('../models/serviceModel');
const allocationModel = require('../models/serviceAllocationModel');

/**
 * Controlador para la gestión de:
 *  - Servicios (tabla "services")
 *  - Recursos asignados a un servicio (tabla "service_assigned_resources")
 *  - Asignaciones semanales de horas (tabla "service_resource_allocations")
 */
module.exports = {
  // ---------------------------------------------------------------------------
  // CRUD DE SERVICIOS
  // ---------------------------------------------------------------------------

  /**
   * GET /api/services
   * Retorna la lista de todos los servicios
   */
  getAllServices: async (req, res) => {
    try {
      const services = await serviceModel.getAll();
      return res.json(services);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  /**
   * POST /api/services
   * Crea un nuevo servicio
   */
  createService: async (req, res) => {
    try {
      const { client_id, description, opportunity_number, start_date, end_date } = req.body;

      // Validaciones mínimas
      if (!client_id) {
        return res.status(400).json({ error: 'El campo "client_id" es obligatorio.' });
      }
      if (!start_date || !end_date) {
        return res.status(400).json({ error: 'La fecha de inicio y fin son obligatorias.' });
      }
      if (opportunity_number && opportunity_number.length > 15) {
        return res.status(400).json({ error: 'El campo "Numero de Oportunidad" no puede exceder 15 caracteres.' });
      }

      // Crear en la BD
      const newService = await serviceModel.create({
        client_id,
        description,
        opportunity_number,
        start_date,
        end_date,
      });
      return res.status(201).json(newService);
    } catch (error) {
      console.error('Error al crear servicio:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  /**
   * PUT /api/services/:id
   * Actualiza un servicio existente
   */
  updateService: async (req, res) => {
    try {
      const { id } = req.params;
      const { client_id, description, opportunity_number, start_date, end_date } = req.body;

      if (!client_id) {
        return res.status(400).json({ error: 'El campo "client_id" es obligatorio.' });
      }
      if (!start_date || !end_date) {
        return res.status(400).json({ error: 'La fecha de inicio y fin son obligatorias.' });
      }
      if (opportunity_number && opportunity_number.length > 15) {
        return res.status(400).json({ error: 'El campo "Numero de Oportunidad" no puede exceder 15 caracteres.' });
      }

      const updatedService = await serviceModel.update(id, {
        client_id,
        description,
        opportunity_number,
        start_date,
        end_date,
      });
      if (!updatedService) {
        return res.status(404).json({ error: 'Servicio no encontrado.' });
      }
      return res.json(updatedService);
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  /**
   * DELETE /api/services/:id
   * Elimina un servicio existente
   */
  deleteService: async (req, res) => {
    try {
      const { id } = req.params;
      await serviceModel.remove(id);
      return res.json({ message: 'Servicio eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // ---------------------------------------------------------------------------
  // ASIGNACIÓN DE RECURSOS (TABLA "service_assigned_resources")
  // ---------------------------------------------------------------------------

  /**
   * GET /api/services/:serviceId/assigned-resources
   * Retorna la lista de recursos asignados a un servicio (sin las asignaciones semanales)
   */
  getAssignedResources: async (req, res) => {
    try {
      const { serviceId } = req.params;
      const assigned = await allocationModel.getAssignedResourcesByService(serviceId);
      return res.json(assigned);
    } catch (error) {
      console.error('Error al obtener recursos asignados:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  /**
   * POST /api/services/:serviceId/assigned-resources
   * Asigna un recurso al servicio (sin semanas), insertando en la tabla "service_assigned_resources"
   */
  assignResource: async (req, res) => {
    try {
      const { serviceId } = req.params;
      const { resource_id } = req.body;
      if (!resource_id) {
        return res.status(400).json({ error: 'resource_id es obligatorio.' });
      }

      const assigned = await allocationModel.assignResource(serviceId, resource_id);
      return res.status(201).json(assigned);
    } catch (error) {
      console.error('Error al asignar recurso al servicio:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  /**
   * DELETE /api/services/assigned-resources/:id
   * Desasigna un recurso (fila en "service_assigned_resources" por su PK 'id')
   */
  unassignResource: async (req, res) => {
    try {
      const { id } = req.params;
      await allocationModel.unassignResource(id);
      return res.json({ message: 'Recurso desasignado correctamente.' });
    } catch (error) {
      console.error('Error al desasignar recurso:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // ---------------------------------------------------------------------------
  // ASIGNACIONES SEMANALES (TABLA "service_resource_allocations")
  // ---------------------------------------------------------------------------

  /**
   * GET /api/services/:serviceId/allocations
   * Retorna las asignaciones semanales (week_date, hours) de cada recurso en un servicio
   */
  getAllocations: async (req, res) => {
    try {
      const { serviceId } = req.params;
      const allocations = await allocationModel.getAllocationsByService(serviceId);
      return res.json(allocations);
    } catch (error) {
      console.error('Error al obtener asignaciones:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  /**
   * POST /api/services/:serviceId/allocations
   * Crea una asignación semanal (recurso, semana, horas)
   */
  createAllocation: async (req, res) => {
   try {
	 // Tomamos el service_id de la ruta
	 const service_id = req.params.serviceId;
	 // El body trae resource_id, week_date, hours
	 const { resource_id, week_date, hours } = req.body;

	 // Validaciones
	 if (!resource_id || !week_date) {
	   return res.status(400).json({ error: 'Faltan campos obligatorios en la asignación (resource_id, week_date).' });
	 }

	 // Crear allocation con service_id tomado de la ruta
	 const newAlloc = await allocationModel.createAllocation({
	   service_id,
	   resource_id,
	   week_date,
	   hours,
	 });
	 return res.status(201).json(newAlloc);
   } catch (error) {
 	 console.error('Error al crear asignación:', error);
 	 return res.status(500).json({ error: 'Error interno del servidor' });
   }
 },

  /**
   * PUT /api/services/allocations/:id
   * Actualiza las horas de una asignación semanal
   */
  updateAllocation: async (req, res) => {
    try {
      const { id } = req.params;
      const { hours } = req.body;
      if (hours == null) {
        return res.status(400).json({ error: 'El campo "hours" es obligatorio.' });
      }

      const updatedAlloc = await allocationModel.updateAllocation(id, { hours });
      if (!updatedAlloc) {
        return res.status(404).json({ error: 'Asignación no encontrada.' });
      }
      return res.json(updatedAlloc);
    } catch (error) {
      console.error('Error al actualizar asignación:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  /**
   * DELETE /api/services/allocations/:id
   * Elimina una asignación semanal
   */
  deleteAllocation: async (req, res) => {
    try {
      const { id } = req.params;
      await allocationModel.removeAllocation(id);
      return res.json({ message: 'Asignación eliminada correctamente.' });
    } catch (error) {
      console.error('Error al eliminar asignación:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};
