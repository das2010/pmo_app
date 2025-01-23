const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');

// Rutas CRUD de modules
router.get('/', moduleController.getAll);         // Listar todos
router.get('/:id', moduleController.getById);     // Obtener uno por ID
router.post('/', moduleController.create);        // Crear
router.put('/:id', moduleController.update);      // Actualizar
router.delete('/:id', moduleController.remove);   // Eliminar

module.exports = router;
