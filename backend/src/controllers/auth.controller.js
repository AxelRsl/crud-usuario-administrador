const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { name, email, password, age, city, gender, role } = req.body;
    const errores = [];

    // Validaciones
    if (!name || String(name).trim() === '') {
      errores.push('Error: colocar un nombre');
    }

    if (!email || String(email).trim() === '') {
      errores.push('Error: colocar un correo');
    } else {
      // Validar formato de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(email).trim())) {
        errores.push('Error: el correo no es válido');
      }
    }

    if (!password || String(password).length < 8) {
      errores.push('Error: la contraseña debe tener mínimo 8 caracteres');
    }

    // Si hay errores, enviarlos todos juntos
    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ errores: ['El correo electrónico ya está registrado'] });
    }

    // Crear nuevo usuario
    const newUser = new User({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      password,
      age,
      city,
      gender,
      role: role || 'cliente' // Por defecto es cliente si no se especifica
    });

    await newUser.save();

    // Generar token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'mysecretkey',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        age: newUser.age,
        city: newUser.city,
        gender: newUser.gender,
        photo: newUser.photo,
        cv: newUser.cv,
        bill: newUser.bill
      },
      messages: ['Usuario registrado con éxito']
    });

  } catch (error) {
    res.status(500).json({ errores: ['Error al registrar usuario: ' + error.message] });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errores = [];

    // Validaciones
    if (!email || String(email).trim() === '') {
      errores.push('Error: colocar un correo');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(email).trim())) {
        errores.push('Error: el correo no es válido');
      }
    }

    if (!password || String(password).trim() === '') {
      errores.push('Error: colocar una contraseña');
    }

    // Si hay errores, enviarlos todos juntos
    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    // Buscar usuario por email
    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ errores: ['Usuario no encontrado'] });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ errores: ['Contraseña incorrecta'] });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'mysecretkey',
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        city: user.city,
        gender: user.gender,
        photo: user.photo,
        cv: user.cv,
        bill: user.bill
      },
      messages: ['Inicio de sesión exitoso']
    });

  } catch (error) {
    res.status(500).json({ errores: ['Error al iniciar sesión: ' + error.message] });
  }
};
