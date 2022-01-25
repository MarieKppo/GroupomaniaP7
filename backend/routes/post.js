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

//routes pour les partages
// router.get('/sharedPosts', auth, postCtrl.getAllSharedPosts); // affiche ttes les publi partagées
router.post('/:id/share', auth, postCtrl.sharePost);//partager une publi

//routes pour les commentaires
router.post("/:id/comment", auth, postCtrl.createComment); //poster un commentaire
// router.post("/:id/reaction", auth, postCtrl.reactPost); //poster une réaction
router.get("/:id/comments", auth, postCtrl.getAllComments); // afficher ts les comms d'une publi
router.delete("/:id/comment", auth, postCtrl.deleteOneComment);//suppri un comm

module.exports = router;
