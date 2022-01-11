const express = require('express');
//ajouter helmet + cors package
const mysql = require('mysql');

//importation des routes 

//application d'express
const app = express();


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
//ajouter le package middleware cors + helmet

//connexion bdd
const groupomania = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database : "groupomania"
});

groupomania.connect(function(err) {
  if (err) throw err;
  console.log("Connecté à la base de données MySQL!");
});

//listes user ids
groupomania.query("SELECT id FROM user", function (err, result) {
  if (err) throw err;
  const userIds = JSON.stringify(result);
  console.log('les ' + result.length + ' identifiants utilisateurs sont les suivants : '+ userIds);
});
// fermeture de la connexion à la bdd ?? à la fin ?
// db.connection.end();

app.use(express.json());

app.post('/api/stuff', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
      message: 'Objet créé !'
    });
  });

app.get('/api/', (req, res, next) => {
  console.log('test requête GET');
  const contentIds = groupomania.query("SELECT id, content FROM post", function (err, result) {
    if (err) throw err;
    console.log(result);
  }); // retourne un tableau 'circular' non stringifiable 
  const message = 'le résultat de la requête est : ' + contentIds;
  res.status(200).json({message})
});


app.get('/api/stuff', (req, res, next) => {
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


module.exports = app;