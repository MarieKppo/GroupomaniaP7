// modules
const mysql = require('../Database').connection; //connecion bdd
require('dotenv').config();
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const fs = require('fs'); //génère fichier stockés
const Utils = require('../utils/utils');

//fonction pour créer un compte 
exports.signup = (req, res, next) => {
    if((/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/).test(req.body.password) &&
        (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(req.body.email)) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const email = req.body.email;
                const firstName = req.body.firstName;
                const lastName = req.body.lastName;
                const password = hash;
                const pseudo = req.body.pseudo;

                let sqlSignup = "INSERT INTO users (lastName, firstName, email, password, pseudo) VALUES (?, ?, ?, ?, ?)";
                let values = [lastName, firstName, email, password, pseudo]; // nécessité d'un tableau pour que mysql query boucle sur les données

                mysql.query(sqlSignup, values, function (err, result) {
                    let message = "Erreur côté base de données. Veuillez contacter un responsable.";
                    if (err) {
                        if(err.code === 'ER_DUP_ENTRY'){
                            message = "Cette adresse mail est déjà utilisée. Veuillez en choisir une autre pour créer votre compte."
                        }
                        return res.status(500).json({err , message});
                    };
                    res.status(201).json({
                        message: "Compte créé !"
                    });
                });
            })
            .catch(e => res.status(500).json(e));
    }else {
        if(!(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/).test(req.body.password)){
            return res.status(400).json({
                message : "Votre mot de passe doit contenir au moins 8 caractères dont au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial."})
        }
        if(!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(req.body.email)){
            return res.status(400).json({
                message : "Votre adresse mail doit correspondre au format \"xxx@xxx.xxx\"."})
        }
    }
}
//fin fonction pour créer un compte 

// fonction pour se connecter
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const sqlFindUser = "SELECT * FROM users WHERE email = ?";
    mysql.query(sqlFindUser, email, function (err, result) {
        if (err) {
            return res.status(500).json(err.message); // lister les erreurs possibles : mail déjà utilisé, info manquante ?
        };
        if (result.length == 0) {
            return res.status(401).json({
                error: "Compte utilisateur non trouvé !"
            });
        };
        bcrypt.compare(password, result[0].password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({
                        error: "Mot de passe incorrect !"
                    });
                }
                let usAd = {
                    'userId': result[0].id,
                    'isAdmin': !!result[0].isAdmin // transforme le tinyint(1) en true ou false
                };
                res.status(200).json({
                    userId: result[0].id,
                    token: jwt.sign(usAd, `${process.env.TOKEN_KEY}`, {expiresIn: "24h"}),
                    isAdmin: result[0].isAdmin
                })
            })
            .catch(e => res.status(500).json(e));
    });
};
// fin fonction pour se connecter

// fonction pour afficher le profil
exports.getOneUser = (req, res, next) => {
    let userId = req.params.id;
    console.log(req.params.id)
    const sqlGetUser = `SELECT id AS userId, lastName, firstName, email, pseudo, profilePic
    FROM users WHERE id = ?`;
    mysql.query(sqlGetUser, [userId], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            return res.status(400).json({
                message: "aucun utilisateur trouvé avec cet id"
            });
        }
        res.status(200).json(result);
    });
}
// fin fonction pour afficher le profil

// modifier la photo de profil 
exports.modifyUserPic = (req, res, next) => {
    const userIdAsked = req.params.id; //id de l'url/route
    const token = Utils.getReqToken(req);
    const userId = token.userId;
    const isAdmin = token.isAdmin;
    if ((userId != userIdAsked) && (!isAdmin)) {
        return res.status(403).json({
            message: "Vous ne pouvez pas modifier la photo d'un profil qui n'est pas le vôtre."
        });
    } else {
        if (req.file === "" || req.file === undefined || req.file === null) {
            return res.status(400).json({
                message: "Vous devez sélectionner une image pour la télécharger sur votre profil"
            })
        }
        if (req.file) {
            const profilePic = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`; // recup nouvelle photo            
            const sqlFindUser = `SELECT profilePic FROM users WHERE id = ?`;
            const sqlModifyPic = `UPDATE users SET profilePic = ? WHERE id = ?`;
            mysql.query(sqlFindUser, [userId], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        message: "changement impossible !"
                    });
                }
                const filename = result[0].profilePic.split("/images/")[1]; // nom de l'image stockée dans la bdd
                if (filename !== "defaultProfilePic.jpg") {
                    fs.unlink(`images/${filename}`, () => { //suppression du fichier si diff de photo par défaut 
                        mysql.query(sqlModifyPic, [profilePic, userIdAsked], function (err, result) { //ajout nouvelle photo
                            if (err) {
                                return res.status(500).json(err.message);
                            };
                            return res.status(200).json({
                                message: "Photo de profil modifiée !"
                            });
                        });
                    })
                } else { //ajout de la nouvelle photo à la place de celle par défaut
                    mysql.query(sqlModifyPic, [profilePic, userIdAsked], function (err, result) {
                        if (err) {
                            return res.status(500).json(err.message);
                        };
                        return res.status(200).json({
                            message: "Photo de profil modifiée ! Dommage le chaton était tout mims"
                        });
                    });
                }
            });
        }
    }
}
// fin modifier la photo de profil 

// fonction pour modifier le pseudo d'un user 
exports.modifyUserPseudo = (req, res, next) => {
    const userIdPseudo = req.params.id; 
    const token = Utils.getReqToken(req);
    const userId = token.userId;
    const isAdmin = token.isAdmin;

    if ((userId != userIdPseudo) && (!isAdmin)) {
        return res.status(403).json({
            message: "Vous ne pouvez pas modifier le pseudo d'un profil qui n'est pas le vôtre."
        });
    } else {
        const password = req.body.password;
        const newPseudo = req.body.pseudo;

        const sqlFindUser = "SELECT password FROM users WHERE id = ?";
        mysql.query(sqlFindUser, [userId], function (err, result) {
            if (err) {
                return res.status(500).json(err.message); 
            };
            if (result.length == 0) {
                return res.status(401).json({
                    error: "Compte utilisateur non trouvé !"
                });
            };
            bcrypt.compare(password, result[0].password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            error: "Mot de passe incorrect !"
                        }); //ou identifiant
                    }
                    const sqlModifyPseudo = `UPDATE users SET pseudo = ? WHERE id = ?`;
                    mysql.query(sqlModifyPseudo, [newPseudo, userIdPseudo], function (err, result) {
                        if (err) {
                            return res.status(500).json(err.message);
                        };
                        return res.status(201).json({
                            message: "Pseudo modifié ! "
                        });
                    })
                })
                .catch(e => res.status(500).json(e));
        });
    }
}
// fin fonction pour modifier le pseudo d'un user 

// modifier le mot de passe d'un utilisateur
exports.modifyUserPassword = (req, res, next) => {
    const userIdPassword = req.params.id; 
    const newPassword = req.body.newPassword;
    const password = req.body.password;
    const token = Utils.getReqToken(req);
    const userId = token.userId;
    const isAdmin = token.isAdmin;

    if ((userId != userIdPassword) && (!isAdmin)) {
        return res.status(403).json({
            message: "Vous ne pouvez pas modifier le pseudo d'un profil qui n'est pas le vôtre."
        });
    } else {
        let verifPwd = (/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/).test(newPassword);
        if(verifPwd){
            const sqlFindUser = `SELECT password FROM users WHERE id = ?`;
            mysql.query(sqlFindUser, [userIdPassword], function (err, result) {
                if (err) {
                    return res.status(500).json(err.message);
                }
                if (result.length == 0) {
                    return res.status(401).json({
                        error: "Pas d'utilisateur trouvé !"
                    });
                }
                const hashedPassword = result[0].password;
                bcrypt.compare(password, hashedPassword)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({
                                error: "Mot de passe incorrect !"
                            });
                        }
                        if (newPassword) { // si un nouvo mdp donné et mdp original est ok/vérif
                            bcrypt.hash(newPassword, 10)
                                .then(hash => {
                                    const sqlChangePassword = `UPDATE users SET password= ? WHERE id = ?`;
                                    mysql.query(sqlChangePassword, [hash, userIdPassword], function (err, result) {
                                        if (err) {
                                            return res.status(500).json(err.message);
                                        }
                                        if (result.affectedRows == 0) {
                                            return res.status(400).json({
                                                message: "Echec du changement de mot de passe"
                                            });
                                        }
                                        return res.status(201).json({
                                            message: "Mot de passe modifié avec succès !"
                                        });
                                    });
                                })
                                .catch(e => res.status(500).json(e));
                        }
                    })
                    .catch(e => res.status(500).json(e));
            });
        }
        else{
            return res.status(400).json({message: "Votre mot de passe doit contenir au moins 8 caractères dont au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial."})
        }
    }
}
// fin modifier le mot de passe d'un utilisateur

// fonction pour supprimer un compte utilisateur
exports.deleteOneUser = (req, res, next) => {
    const password = req.body.password;
    const email = req.body.email;
    const userIdToDelete = req.params.id; 
    const token = Utils.getReqToken(req);
    const userId = token.userId;
    const isAdmin = token.isAdmin;
    
    if ((userIdToDelete != userId) && (!isAdmin)) {
        return res.status(403).json({
            message: "Vous n'avez pas les droits nécessaires à la suppression de ce profil."
        });
    } 
    if (userIdToDelete == userId) {
        let sqlFindUser = "SELECT password, profilePic FROM users WHERE email = ?"; //recup user dans bdd
        mysql.query(sqlFindUser, [email], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }
            if (result.length == 0) {
                return res.status(404).json({
                    error: "Utilisateur non trouvé !"
                });
            }            
            let hashedPassword = result[0].password;
            bcrypt.compare(password, hashedPassword)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            error: "Mot de passe incorrect !"
                        });
                    }
                    const filename = result[0].profilePic.split("/images/")[1];
                    if (filename !== "defaultProfilePic.jpg") {
                        fs.unlink(`./images/${filename}`, (e) => { 
                            if (e) {
                                console.log(e);
                            }
                        })
                    }
                    let sqlDeleteUser = "DELETE FROM users WHERE id = ?";
                    mysql.query(sqlDeleteUser, [userIdToDelete], function (err, result) {
                        if (err) {
                            return res.status(500).json(err.message);
                        };
                        if (result.affectedRows == 0) {
                            return res.status(400).json({
                                message: "échec suppression"
                            });
                        }
                        res.status(204).json({
                            message: "Compte utilisateur supprimé !"
                        });
                    });
            })
            .catch(e => {
                    console.log('erreur ici ' + e)
                    res.status(500).json(e)
            });
            
        });
    } 
    if (isAdmin){ 
        let sqlFindUser = "SELECT password, email FROM users WHERE id = ?"; 
        mysql.query(sqlFindUser, [userId], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }
            if (result.length == 0) {
                return res.status(404).json({
                    error: "Utilisateur non trouvé !"
                });
            }
            if (result[0].email == email){
                let hashedPassword = result[0].password;

                bcrypt.compare(password, hashedPassword)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            error: "Mot de passe incorrect !"
                        });
                    }
                    let sqlFindUserToDelete = "SELECT profilePic FROM users WHERE id = ?";  
                    mysql.query(sqlFindUserToDelete, [userIdToDelete], function (err, result){
                        if(err){
                            return res.status(500).json(err.message)
                        };
                        const filename = result[0].profilePic.split("/images/")[1];
                        if (filename !== "defaultProfilePic.jpg") {
                            fs.unlink(`./images/${filename}`, (e) => { // On supprime le fichier image si autre que par défaut
                                if (e) {
                                    console.log(e);
                                }
                            })
                        }
                        let sqlDeleteUser = "DELETE FROM users WHERE id = ?";
                        mysql.query(sqlDeleteUser, [userIdToDelete], function (err, result) {
                            if (err) {
                                return res.status(500).json(err.message);
                            };
                            if (result.affectedRows == 0) {
                                return res.status(400).json({
                                    message: "échec suppression"
                                });
                            }
                            res.status(204).json({
                                message: "Compte utilisateur supprimé !"
                            });
                        });
                    });
                })
                .catch(e => {
                        res.status(500).json(e)
                });
            }   
        });
    }            
}
// fin fonction pour supprimer un compte utilisateur
