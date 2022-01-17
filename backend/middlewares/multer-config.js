const multer = require('multer');

// Liste Mime Types possibles
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};

// stockage
const storage = multer.diskStorage({ // Configure multer
  destination: (req, file, callback) => { // où enregistrer les fichiers
    callback(null, 'images');
  },
  filename: (req, file, callback) => { // nom du fichier
    const name = file.originalname.split(' ').join('_'); // Retire les espaces
    const extension = MIME_TYPES[file.mimetype]; // Défini le type
    callback(null, name + Date.now() + '.' + extension); // Génère le nom unique
  }
});

module.exports = multer({storage: storage}).single('image');