const express = require('express');
const router = express.Router();

//middlewares
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
// importer la logique métier : 
const userCtrl = require('../controllers/user');


//routes du parcours utilisateur à implementer
router.post('/signup', userCtrl.signup); //inscription 
router.post('/login', userCtrl.login); //connexion
router.get('/profile/:id', auth, userCtrl.getOneUser);//afficher 1 user 
router.delete('/profile/:id', auth, userCtrl.deleteOneUser);//supprimer le profil user
router.put('/pseudo/:id', auth, userCtrl.modifyUserPseudo); //modifier un user pseudo
router.put('/profilePic/:id', auth, multer, userCtrl.modifyUserPic); //modifier un user profilepic
router.put('/password/:id', auth, userCtrl.modifyUserPassword); //modifier un user password


module.exports = router;