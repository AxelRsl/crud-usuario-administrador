const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.authenticate = async (req, res, next) => {
  try {
    // Obtener token del encabezado
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');

    // Buscar usuario
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Adjuntar usuario y rol a la solicitud
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido', error: error.message });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador' });
  }
  next();
};

exports.isClient = (req, res, next) => {
  if (req.userRole !== 'cliente') {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de cliente' });
  }
  next();
};
