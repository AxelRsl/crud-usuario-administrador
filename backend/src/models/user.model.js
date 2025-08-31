const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: [18, 'La edad debe ser igual o mayor a 18 años']
  },
  city: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['masculino', 'femenino', 'otro']
  },
  role: {
    type: String,
    enum: ['admin', 'cliente'],
    default: 'cliente'
  },
  photo: {
    type: String,
    default: ''
  },
  cv: {
    type: String,
    default: ''
  },
  bill: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Método para encriptar contraseña antes de guardar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
