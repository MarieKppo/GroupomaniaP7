//importation des dépendances et modules requis pour les routes
const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

//routes pour les posts
router.get('/', auth, postCtrl.getAllPosts); //afficher ttes les publi
router.get('/:id', auth, postCtrl.getOnePost); //afficher une publi
router.post('/', auth, multer, postCtrl.createPost); //écrire une publi
router.delete('/:id', auth, postCtrl.deleteOnePost); //suppri une publi
router.post('/:id/comment', auth, postCtrl.createComment);//ajouter un commentaire

module.exports = router;