//importation des dépendances et modules requis pour les routes
const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middlewares/auth');
const multerPost = require('../middlewares/multer-posts-config');

//routes pour les posts
router.get('/', auth, postCtrl.getAllPosts);  
router.get('/:id', auth, postCtrl.getOnePost); 
router.get('/profile/:id/posts', auth, postCtrl.getAllPostsOfUser); 
router.post('/', auth, multerPost, postCtrl.createPost); 
router.delete('/:id', auth, postCtrl.deleteOnePost); 
//routes pour les partages
router.post('/share/:id', auth, postCtrl.sharePost);
router.get('/share/:id', auth, postCtrl.getOneSharedPost);
router.delete('/share/:id', auth, postCtrl.deleteSharedPost); 
//routes pour les commentaires
router.post("/:id/comment", auth, postCtrl.createComment);
router.get("/:id/comments", auth, postCtrl.getAllComments); 
router.delete("/comment/:id", auth, postCtrl.deleteOneComment);

module.exports = router;
