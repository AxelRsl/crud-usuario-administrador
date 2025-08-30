const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Todas las rutas de archivos requieren autenticación
router.use(authMiddleware.authenticate);

// Rutas para subir diferentes tipos de archivos
router.post('/upload/photo', fileController.uploadPhoto);
router.post('/upload/cv', fileController.uploadCV);
router.post('/upload/bill', fileController.uploadBill);

module.exports = router;
