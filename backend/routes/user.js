const express = require('express');
const router = express.Router();

// importer la logique métier : 
const userCtrl = require('../controllers/user');

//middlewares
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

//routes du parcours utilisateur à implementer
router.post('/signup', userCtrl.signup); //inscription 
router.post('/login', userCtrl.login); //connexion
router.delete('/delete', userCtrl.deleteOneUser);//supprimer le profil user
router.get('/profile/:id', auth, userCtrl.getOneUser);//afficher 1 user 
router.put('/profile/:id', auth, userCtrl.modifyOneUser); //modifier un user

module.exports = router;