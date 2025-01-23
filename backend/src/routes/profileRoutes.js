const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Rutas /api/profiles
router.get('/', profileController.getAllProfiles);
router.post('/', profileController.createProfile);
router.put('/:id', profileController.updateProfile);
router.delete('/:id', profileController.deleteProfile);

module.exports = router;