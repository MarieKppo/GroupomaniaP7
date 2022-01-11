//app.post(chemin de l'api + controllers user + nom fonction (signUp ou login)
const express = require('express');
const router = express.Router();
// importer la logique métier : 
const userCtrl = require('../controllers/user');

//routes du parcours utilisateur à implementer
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;

// trash code
// router.post('/', (req, res, next) => {
//   console.log(req.body);
//   res.status(201).json({
//     message: 'Objet créé !'
//   });
// });

// router.get('/', (req, res, next) => {
// console.log('test requête GET');
// const contentIds = groupomania.query("SELECT id, content FROM post", function (err, result) {
//   if (err) throw err;
//   console.log(result);
// }); // retourne un tableau 'circular' non stringifiable 
// const message = 'le résultat de la requête est : ' + contentIds;
// res.status(200).json({message})
// next();
// });

// router.delete('/', (req, res, next) => {
// console.log('Supprimé');

// })