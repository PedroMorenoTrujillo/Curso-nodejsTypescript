// Importamos express
const express = require('express');

// Importamos controller
const usersController = require('../../controllers/v1/usersController');

// Importar el middleware
const { isValidHostname, isAuth, isAdmin } = require('../../middlewares/auth');

// Iniciar el router
const router = express.Router();

// Definir rutas
// Rutas de tipo post
router.post('/login', usersController.login);
router.post('/create', usersController.createUser);
router.post('/update', isValidHostname, isAuth, usersController.updateUser);
router.post('/delete', isAuth, isAdmin, usersController.deleteUser);
router.get('/get-all', isAuth, isAdmin, usersController.getUsers);

// Exportar routes
module.exports = router;
