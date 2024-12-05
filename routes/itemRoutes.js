const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// CRUD operations
router.get('/items', itemController.getAllItems);
router.post('/items', itemController.createItem);
router.put('/items/:id', itemController.updateItem);
router.patch('/items/:id', itemController.partialUpdateItem);
router.delete('/items/:id', itemController.deleteItem);

// Random Quote API route
router.get('/quote', itemController.getRandomQuote);

module.exports = router;
