const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/user.model');

// Configurar almacenamiento para diferentes tipos de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadFolder = '';

    // Determinar la carpeta de destino según el tipo de archivo
    if (file.fieldname === 'photo') {
      uploadFolder = 'uploads/photos';
    } else if (file.fieldname === 'cv') {
      uploadFolder = 'uploads/cv';
    } else if (file.fieldname === 'bill') {
      uploadFolder = 'uploads/bills';
    }

    const dir = path.join(__dirname, '..', uploadFolder);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Función para filtrar archivos por tipo
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'photo') {
    // Aceptar solo imágenes
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  } else if (file.fieldname === 'cv') {
    // Aceptar PDF y documentos
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Solo se permiten archivos PDF o documentos Word'), false);
    }
  } else if (file.fieldname === 'bill') {
    // Aceptar PDF e imágenes para recibos
    if (!file.mimetype.startsWith('image/') && file.mimetype !== 'application/pdf') {
      return cb(new Error('Solo se permiten imágenes o PDF para los recibos'), false);
    }
  }

  cb(null, true);
};

// Configurar límites de tamaño para los archivos
const limits = {
  fileSize: 5 * 1024 * 1024 // 5MB
};

// Inicializar multer con las configuraciones
const upload = multer({ storage, fileFilter, limits });

// Subir foto
exports.uploadPhoto = [
  upload.single('photo'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ errores: ['No se ha subido ninguna imagen'] });
      }

      // Guardar la ruta en el usuario
      const user = await User.findById(req.userId);

      // Eliminar la foto anterior si existe
      if (user.photo) {
        const oldPhotoPath = path.join(__dirname, '..', user.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }

      // Actualizar usuario con la nueva ruta de la foto
      const photoPath = `uploads/photos/${req.file.filename}`;
      user.photo = photoPath;
      await user.save();

      res.json({
        success: true,
        filePath: photoPath,
        messages: ['Foto subida con éxito']
      });
    } catch (error) {
      res.status(500).json({ errores: ['Error al subir la foto: ' + error.message] });
    }
  }
];

// Subir CV
exports.uploadCV = [
  upload.single('cv'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ errores: ['No se ha subido ningún CV'] });
      }

      // Guardar la ruta en el usuario
      const user = await User.findById(req.userId);

      // Eliminar el CV anterior si existe
      if (user.cv) {
        const oldCVPath = path.join(__dirname, '..', user.cv);
        if (fs.existsSync(oldCVPath)) {
          fs.unlinkSync(oldCVPath);
        }
      }

      // Actualizar usuario con la nueva ruta del CV
      const cvPath = `uploads/cv/${req.file.filename}`;
      user.cv = cvPath;
      await user.save();

      res.json({
        success: true,
        filePath: cvPath,
        messages: ['CV subido con éxito']
      });
    } catch (error) {
      res.status(500).json({ errores: ['Error al subir el CV: ' + error.message] });
    }
  }
];

// Subir recibo
exports.uploadBill = [
  upload.single('bill'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ errores: ['No se ha subido ningún recibo'] });
      }

      // Guardar la ruta en el usuario
      const user = await User.findById(req.userId);

      // Eliminar el recibo anterior si existe
      if (user.bill) {
        const oldBillPath = path.join(__dirname, '..', user.bill);
        if (fs.existsSync(oldBillPath)) {
          fs.unlinkSync(oldBillPath);
        }
      }

      // Actualizar usuario con la nueva ruta del recibo
      const billPath = `uploads/bills/${req.file.filename}`;
      user.bill = billPath;
      await user.save();

      res.json({
        success: true,
        filePath: billPath,
        messages: ['Recibo subido con éxito']
      });
    } catch (error) {
      res.status(500).json({ errores: ['Error al subir el recibo: ' + error.message] });
    }
  }
];
