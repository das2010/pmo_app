const express = require('express');
const router = express.Router();
const sectorController = require('../controllers/sectorController');

// Rutas /api/sectors
router.get('/', sectorController.getAllSectors);
router.post('/', sectorController.createSector);
router.put('/:id', sectorController.updateSector);
router.delete('/:id', sectorController.deleteSector);

module.exports = router;
