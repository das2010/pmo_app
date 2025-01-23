const express = require('express');
const router = express.Router();
const permissionGroupController = require('../controllers/permissionGroupController');

// CRUD Grupos
router.get('/', permissionGroupController.getAllGroups);
router.post('/', permissionGroupController.createGroup);
router.put('/:id', permissionGroupController.updateGroup);
router.delete('/:id', permissionGroupController.deleteGroup);

// Módulos asignados al grupo
router.get('/:groupId/modules', permissionGroupController.getModulesByGroup);
router.post('/:groupId/modules', permissionGroupController.assignModule);
router.delete('/:groupId/modules/:moduleId', permissionGroupController.unassignModule);

module.exports = router;