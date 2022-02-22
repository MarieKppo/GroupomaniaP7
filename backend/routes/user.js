const express = require('express');
const router = express.Router();

//middlewares
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const userCtrl = require('../controllers/user');

//routes du parcours utilisateur
router.post('/signup', userCtrl.signup); 
router.post('/login', userCtrl.login); 
router.get('/:id', auth, userCtrl.getOneUser); 
router.delete('/:id', auth, userCtrl.deleteOneUser);
router.put('/:id/pseudo', auth, userCtrl.modifyUserPseudo); 
router.put('/:id/profilePic', auth, multer, userCtrl.modifyUserPic); 
router.put('/:id/password', auth, userCtrl.modifyUserPassword); 

module.exports = router;