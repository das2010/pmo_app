const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

/** Rutas para RECURSOS */

// Listar todos
router.get('/', resourceController.getAllResources);
// Crear
router.post('/', resourceController.createResource);
// Actualizar
router.put('/:id', resourceController.updateResource);
// Eliminar
router.delete('/:id', resourceController.deleteResource);

/** Rutas para DISPONIBILIDAD de cada recurso */

// Listar disponibilidad de un recurso
router.get('/:resourceId/availabilities', resourceController.getAvailabilitiesByResource);

// Crear nueva disponibilidad
router.post('/:resourceId/availabilities', resourceController.createAvailability);

// Editar disponibilidad
router.put('/availabilities/:id', resourceController.updateAvailability);

// Eliminar disponibilidad
router.delete('/availabilities/:id', resourceController.deleteAvailability);

module.exports = router;