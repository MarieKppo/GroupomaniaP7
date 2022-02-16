const express = require('express');
const router = express.Router();

//middlewares
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const userCtrl = require('../controllers/user');

//routes du parcours utilisateur
router.post('/signup', userCtrl.signup); 
router.post('/login', userCtrl.login); 
router.get('/profile/:id', auth, userCtrl.getOneUser); 
router.delete('/profile/:id', auth, userCtrl.deleteOneUser);
router.put('/pseudo/:id', auth, userCtrl.modifyUserPseudo); 
router.put('/profilePic/:id', auth, multer, userCtrl.modifyUserPic); 
router.put('/password/:id', auth, userCtrl.modifyUserPassword); 

module.exports = router;