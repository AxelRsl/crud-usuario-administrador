const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');

// Obtener todos los usuarios (solo para admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({
      success: true,
      users,
      messages: ['Usuarios obtenidos con éxito']
    });
  } catch (error) {
    res.status(500).json({ errores: ['Error al obtener usuarios: ' + error.message] });
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ errores: ['Usuario no encontrado'] });
    }

    // Solo el propio usuario o un admin puede ver los detalles
    if (req.userRole !== 'admin' && req.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ errores: ['No autorizado para ver este perfil'] });
    }

    res.json({
      success: true,
      user,
      messages: ['Usuario obtenido con éxito']
    });
  } catch (error) {
    res.status(500).json({ errores: ['Error al obtener usuario: ' + error.message] });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const { name, age, city, gender } = req.body;

    // Solo permitir actualizar ciertos campos
    const updateData = { name, age, city, gender };

    // Verificar si el usuario existe
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ errores: ['Usuario no encontrado'] });
    }

    // Verificar autorización (solo el propio usuario o un admin pueden actualizar)
    if (req.userRole !== 'admin' && req.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ errores: ['No autorizado para actualizar este perfil'] });
    }

    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      user: updatedUser,
      messages: ['Usuario actualizado con éxito']
    });
  } catch (error) {
    res.status(500).json({ errores: ['Error al actualizar usuario: ' + error.message] });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    // Verificar si el usuario existe
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ errores: ['Usuario no encontrado'] });
    }

    // Solo un admin o el propio usuario pueden eliminar
    if (req.userRole !== 'admin' && req.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ errores: ['No autorizado para eliminar este usuario'] });
    }

    // Eliminar los archivos asociados si existen
    if (user.photo) {
      const photoPath = path.join(__dirname, '..', user.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    if (user.cv) {
      const cvPath = path.join(__dirname, '..', user.cv);
      if (fs.existsSync(cvPath)) {
        fs.unlinkSync(cvPath);
      }
    }

    if (user.bill) {
      const billPath = path.join(__dirname, '..', user.bill);
      if (fs.existsSync(billPath)) {
        fs.unlinkSync(billPath);
      }
    }

    // Eliminar usuario
    await User.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true,
      messages: ['Usuario eliminado con éxito'] 
    });
  } catch (error) {
    res.status(500).json({ errores: ['Error al eliminar usuario: ' + error.message] });
  }
};

// Obtener perfil del usuario actual
exports.getCurrentUser = async (req, res) => {
  try {
    // El middleware de autenticación ya adjuntó el usuario a la solicitud
    const user = await User.findById(req.userId).select('-password');
    res.json({
      success: true,
      user,
      messages: ['Perfil obtenido con éxito']
    });
  } catch (error) {
    res.status(500).json({ errores: ['Error al obtener perfil: ' + error.message] });
  }
};
