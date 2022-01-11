//app.post(chemin de l'api + controllers user + nom fonction (sihnUp ou login)
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');


router.post('/', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
      message: 'Objet créé !'
    });
  });

router.get('/', (req, res, next) => {
  console.log('test requête GET');
  const contentIds = groupomania.query("SELECT id, content FROM post", function (err, result) {
    if (err) throw err;
    console.log(result);
  }); // retourne un tableau 'circular' non stringifiable 
  const message = 'le résultat de la requête est : ' + contentIds;
  res.status(200).json({message})
  next();
});


router.get('/', (req, res, next) => {
    const stuff = [
      {
        _id: 'oeihfzeoi',
        title: 'Mon premier objet',
        description: 'Les infos de mon premier objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        price: 4900,
        userId: 'qsomihvqios',
      },
      {
        _id: 'oeihfzeomoihi',
        title: 'Mon deuxième objet',
        description: 'Les infos de mon deuxième objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        price: 2900,
        userId: 'qsomihvqios',
      },
    ];
    res.status(200).json(stuff);
  });





//routes du parcours utilisateur
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;