// créer objet connexion base de donnée et l'exporter
const mysql = require('mysql');
const env = require('./environnement'); //récup variables env

//création connexion
exports.connection = mysql.createPool({
  host: "localhost",
  user: "root", //`${env.groupomaniaId}`,
  password: "", // `${env.groupomaniaPW}`,
  database : "groupomania",
  timezone : "local", 
  charset : 'utf8mb4'
});

console.log('connecté à la bdd via database.js')

// fermeture de la connexion à la bdd 
// groupomania.connection.end(); = middleware fermeture de connexion à la bdd à la fin des routes concernées