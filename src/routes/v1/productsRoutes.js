// Importamos express
const express = require('express');

// Importamos controller
const productsController = require('../../controllers/v1/productsController');

const router = express.Router();

// Definir rutas
// Rutas de tipo post
router.post('/create', productsController.createProduct);
router.get('/get-all', productsController.getProducts);
router.get('/get-by-user/:userId', productsController.getProductsByser);


// Exportar routes
module.exports = router;
