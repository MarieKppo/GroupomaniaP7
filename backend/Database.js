const mysql = require('mysql');
require('dotenv').config()

//création connexion
exports.connection = mysql.createPool({  // stockage de connexion 
  host: "localhost",
  user:  `${process.env.Groupomania_ID}`,
  password: `${process.env.Groupomania_PW}`, 
  database : "groupomania",
  timezone : "local", 
  charset : 'utf8mb4',
  connectionLimit : 10, //avec limite d'users en simultané selon charge de connexion
});

console.log('Vous êtes connecté à la BDD !')