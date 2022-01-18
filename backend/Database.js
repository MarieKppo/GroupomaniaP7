// créer objet connexion base de donnée et l'exporter
const mysql = require('mysql');
const env = require('./environnement'); //récup variables env

//création connexion
exports.connection = mysql.createPool({  // stockage de connexion 
  host: "localhost",
  user:  `${env.groupomaniaId}`,//"root",
  password: `${env.groupomaniaPW}`,//"", 
  database : "groupomania",
  timezone : "local", 
  charset : 'utf8mb4',
  connectionLimit : 10, //avec limite d'users en simultané selon charge de connexion
});

console.log('connecté à la bdd via database.js')

// fermeture de la connexion à la bdd 
// groupomania.connection.end(); = middleware fermeture de connexion à la bdd à la fin des routes concernées