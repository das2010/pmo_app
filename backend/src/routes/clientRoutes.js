const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

/** CRUD principal de clientes */
router.get('/', clientController.getAllClients);
router.post('/', clientController.createClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

/** Rutas para contactos */
router.get('/:clientId/contacts', clientController.getContactsByClient);
router.post('/:clientId/contacts', clientController.createContact);
router.put('/contacts/:id', clientController.updateContact);
router.delete('/contacts/:id', clientController.deleteContact);

module.exports = router;
