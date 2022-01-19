// modules
const mysql = require('../Database').connection; //connecion bdd
const env = require('../environnement'); //créer variables d'environnement
const bcrypt = require('bcrypt'); //hacher le mdp
const jwt = require('jsonwebtoken');//token sécu
const fs = require('fs'); //génère fichier stockés

//fonction pour créer un compte //testée ok
exports.signup = (req, res, next) => {
    // console.log('route pour créer un utilisateur');
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const email = req.body.email;
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const password = hash;

            let sqlSignup;
            let values;

            sqlSignup = "INSERT INTO users (lastName, firstName, email, password) VALUES (?, ?, ?, ?)";
            values = [lastName, firstName, email, password]; // nécessité d'un tableau pour que mysql query boucle sur les données

            mysql.query(sqlSignup, values, function (err, result) {
                if (err) {
                    return res.status(500).json(err.message);
                };
                res.status(201).json({ message: "Compte créé !" });
            });
            
        })
        .catch(e => res.status(500).json(e));
}

// fonction pour se connecter //testée ok
exports.login = (req, res, next) => {
    // console.log('se connecter ?');
    const email = req.body.email;
    const password = req.body.password;
    // console.log(res);

    const sqlFindUser = "SELECT id, password FROM users WHERE email = ?";

    mysql.query(sqlFindUser, email, function (err, result) {
        // console.log(result);
        if (err) {
            return res.status(500).json(err.message); // lister les erreurs possibles : mail déjà utilisé, info manquante ?
        };
        if (result.length == 0) {
            return res.status(401).json({ error: "Compte utilisateur non trouvé !" });
        }
        bcrypt.compare(password, result[0].password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: "Mot de passe incorrect !" });
                }
                res.status(200).json({
                    token: jwt.sign(
                        { userId: result[0].id },
                        env.token,
                        { expiresIn: "24h" }
                    )
                });
            })
            .catch(e => res.status(500).json(e));
    });
}

// fonction pour supprimer son compte
exports.deleteOneUser = (req, res, next) => {
    const password = req.body.password;
    let passwordHashed;
    const userId = res.locals.userId;

    let sqlFindUser;
    let sqlDeleteUser;

    sqlFindUser = "SELECT password, profilePic FROM users WHERE userId = ?";
    mysql.query(sqlFindUser, userId, function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (result.length == 0) {
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }

        const filename = result[0].profilePic.split("/images/")[1];
        if (filename !== "testprofilepic.jpg") {
            fs.unlink(`images/${filename}`, (e) => { // On supprime le fichier image
                if (e) {
                    console.log(e);
                }
            })
        }
        passwordHashed = result[0].password;

        bcrypt.compare(password, passwordHashed)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: "Mot de passe incorrect !" });
                }
                sqlDeleteUser = "DELETE FROM users WHERE userId = ?";
                mysql.query(sqlDeleteUser, [userID], function (err, result) {
                    if (err) {
                        return res.status(500).json(err.message);
                    };
                    if (result.affectedRows == 0) {
                        return res.status(400).json({ message: "échec suppression" });
                    }
                    res.status(200).json({ message: "Compte utilisateur supprimé !" });
                });
            })
            .catch(e => res.status(500).json(e));
    });
}
// fonction pour afficher le profil
exports.getOneUser = (req, res, next) => {
    // console.log(res.locals)
    // const userId = res.locals.userId;
    let userId = req.params.id;
    console.log('fonction getOneUser ' + userId)

    let sqlGetUser;

    sqlGetUser = `SELECT id AS userId, lastName, firstName, email, pseudo, profilePic
    FROM users WHERE id = ?`;
    mysql.query(sqlGetUser, [userId], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            return res.status(400).json({ message: "aucun utilisateur trouvé avec cet id" });
        }
        res.status(200).json(result);
    });
}

// fonction de modif du profil
exports.modifyOneUser = (req, res, next) => {
   console.log('modifier un user')
}