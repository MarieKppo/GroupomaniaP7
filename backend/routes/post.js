//importation des dépendances et modules requis pour les routes
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const postCtrl = require('../controllers/post');

//routes pour les sauces
router.post('/', auth, multer, postCtrl.createPost);
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deleteOnePost);
router.get('/', auth, postCtrl.getAllPosts);

module.exports = router;