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
router.get('/profile/:id', auth, userCtrl.getOneUser);//afficher 1 user 
router.put('/profile/:id', auth, userCtrl.modifyOneUser); //modifier un user
router.delete('/delete', auth, userCtrl.deleteOneUser);//supprimer le profil user

module.exports = router;