const path = require('path');
const multer = require('multer');

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/teams'); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        // Genera un nombre único para el archivo, conservando la extensión original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // Obtiene la extensión del archivo original
        cb(null, req.body.shortName + ext);
    }
});

const upload = multer({ storage: storage });

module.exports = upload