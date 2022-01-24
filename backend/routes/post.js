//importation des dépendances et modules requis pour les routes
const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

//routes pour les posts
router.get('/', auth, postCtrl.getAllPosts); //afficher ttes les publi //ok
router.get('/:id', auth, postCtrl.getOnePost); //afficher une publi // ok
router.get('/profile/:id/posts', auth, postCtrl.getAllPostsOfUser); //affiche toutes les publi d'un user // ok
router.post('/', auth, multer, postCtrl.createPost); //écrire une publi //ok
router.delete('/:id', auth, postCtrl.deleteOnePost); //suppri une publi
router.post('/:id/share', auth, postCtrl.sharePost);//partager une publi

module.exports = router;
