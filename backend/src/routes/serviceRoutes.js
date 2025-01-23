const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

/** CRUD de servicios */
router.get('/', serviceController.getAllServices);
router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

/** Rutas para asignar recursos a un servicio (sin semanas) */
router.get('/:serviceId/assigned-resources', serviceController.getAssignedResources);
router.post('/:serviceId/assigned-resources', serviceController.assignResource);
router.delete('/assigned-resources/:id', serviceController.unassignResource);

/** Rutas para asignaciones semanales */
router.get('/:serviceId/allocations', serviceController.getAllocations);
router.post('/:serviceId/allocations', serviceController.createAllocation);
router.put('/allocations/:id', serviceController.updateAllocation);
router.delete('/allocations/:id', serviceController.deleteAllocation);

module.exports = router;
