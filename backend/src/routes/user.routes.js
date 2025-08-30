const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Rutas protegidas - requieren autenticación
router.use(authMiddleware.authenticate);

// Rutas accesibles para todos los usuarios autenticados
router.get('/profile', userController.getCurrentUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Rutas solo para administradores
router.get('/', authMiddleware.isAdmin, userController.getAllUsers);

module.exports = router;
