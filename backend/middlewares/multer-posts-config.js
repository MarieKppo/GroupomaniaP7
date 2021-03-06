//multer pour la gestion des images : stockage, nom et extension
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => { 
        callback(null, 'fichiers')
    },
    filename: (req, file, callback) => {
        //générer le nv nom du fichier
        const name = file.originalname.split('.')[0].split(' ').join('_'); //élimine le pb des espaces et la première extension d'origine
        //mime type
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('visualContent'); // !!!! single "nom de la variable de l'image" sinon bug