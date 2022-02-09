//importation des dépendances et modules requis pour les routes
const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');

const auth = require('../middlewares/auth');
// const multer = require('../middlewares/multer-config');
const multerPost = require('../middlewares/multer-posts-config');


//routes pour les posts
router.get('/', auth, postCtrl.getAllPosts); //afficher ttes les publi //ok
router.get('/:id', auth, postCtrl.getOnePost); //afficher une publi // ok
router.get('/profile/:id/posts', auth, postCtrl.getAllPostsOfUser); //affiche toutes les publi d'un user // ok
router.post('/', auth, multerPost, postCtrl.createPost); //écrire une publi //ok
router.delete('/:id', auth, postCtrl.deleteOnePost); //suppri une publi

//routes pour les partages
router.post('/share/:id', auth, postCtrl.sharePost);//partager une publi
router.get('/share/:id', auth, postCtrl.getOneSharedPost);// afficher un partage de post
router.delete('/share/:id', auth, postCtrl.deleteSharedPost); // suppr un partage
//routes pour les commentaires
router.post("/:id/comment", auth, postCtrl.createComment); //poster un commentaire
router.get("/:id/comments", auth, postCtrl.getAllComments); // afficher ts les comms d'une publi
router.delete("/comment/:id", auth, postCtrl.deleteOneComment);//suppri un comm

module.exports = router;
