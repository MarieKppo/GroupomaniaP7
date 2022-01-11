//fonctions applicables à la route utilisateur = logique métier
//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
//const User = require('../models/User');

//Connexion à un compte utilisateur : login (get)
//SELECT * FROM user WHERE id = tokenId JOIN post ON user.id_user = post.id_user
exports.login = (req, res, next) => {
    console.log('connexion user');
    // User.findOne({email: req.body.email })
    //     .then(User => {

    //     })
}

//Création d'un compte utilisateur : sign up (post)
exports.signup = (req, res, next) =>{
    //création de table si existe pas ?
    let sql = "CREATE TABLE  IF NOT EXISTS user (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, firstname VARCHAR(100) NOT NULL,    email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(100) NOT NULL, pseudo VARCHAR(100) DEFAULT NULL, #id_authority INTEGER DEFAULT NULL)";
    groupomania.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
    //création d'un user 
    let insertUser = "INSERT INTO user ('name','firstname','email', 'password', 'pseudo') VALUES ('Dupont', 'Paul', 'paul.dupont@gmail.com', 'motdepassedepaul', 'Polo')";
    groupomania.query(insertUser, function (err, result) {
        if (err) throw err;
        console.log('utilisateur ajouté' + result);
    });
};

//     // regex mail et condition mdp
//       //hash du mot de passe
//       bcrypt.hash(req.body.password, 10)
//           .then(hash => {
//               const user = new User({
//                   email: req.body.email,
//                   password: hash
//               });
//               user.save()
//               .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
//               .catch(error => res.status(400).json({error}));
//           })
//           .catch(error => res.status(500).json({error}));
//   };


//to modify (put)
//UPDATE user SET 'password' = 'newpassword' WHERE 'id_user' = 'token.id_user';

//to delete (delete)
//DELETE * FROM user WHERE 'id_user' =  'token.id_user';