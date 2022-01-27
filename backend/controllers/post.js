// modules
const mysql = require('../Database').connection;
const bcrypt = require('bcrypt'); //hacher le mdp
const fs = require("fs"); // Permet de gérer les fichiers stockés
const Utils = require("../utils/utils"); //importe la fonction pour décoder le token

// fonction pour afficher tous les posts //ajouter les partages ! + ajouter conditions que l'user ait un compte ?
exports.getAllPosts = (req, res, next) => {
    let sqlGetAllPosts = `SELECT posts.id, posts.content, posts.visualContent, posts.date, posts.id_user,
    users.firstName, users.lastName, users.pseudo, users.profilePic, comments.commentContent, comments.date, comments.id_user, comments.id_post
    FROM posts
    LEFT JOIN users ON users.id = posts.id_user
    left JOIN comments ON comments.id_post=posts.id
    ORDER BY posts.date LIMIT 20`;
    // `SELECT posts.id AS 'postId',
    // posts.content AS 'contenu publication', 
    // posts.date AS 'date publication'
    // FROM posts   
    // ORDER BY posts.date LIMIT 15`;
    mysql.query(sqlGetAllPosts, function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            return res.status(400).json({
                message: "Pas de publications à afficher !"
            });
        }
        res.status(200).json(result);
        console.log("nombre de posts et de partages : " + result.length)
    });
}

// fonction pour afficher les posts d'un user (ajouter partage + vérif si user existe ?) 
exports.getAllPostsOfUser = (req, res, next) => {
    const userId = req.params.id;

    let sqlGetAllPosts = `SELECT posts.id, posts.content, posts.visualContent, posts.date, posts.id_user,
    users.firstName, users.lastName, users.pseudo, users.profilePic
    FROM posts
    LEFT JOIN users ON users.id = posts.id_user
    WHERE posts.id_user = ?
    ORDER BY posts.date LIMIT 20`;

    mysql.query(sqlGetAllPosts, [userId], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            return res.status(400).json({
                message: "Pas de publications à afficher pour cet utilisateur !"
            });
        }
        console.log("nombre de posts et de partages : " + result.length)
        res.status(200).json(result);
    });
}

// fonction recup une publi //done
exports.getOnePost = (req, res, next) => {
    const postId = req.params.id;

    let sqlGetPost = `SELECT posts.id, posts.content, posts.visualContent, posts.date, posts.id_user,
    users.firstName, users.lastName, users.pseudo, users.profilePic
    FROM posts
    LEFT JOIN users ON users.id = posts.id_user
    WHERE posts.id = ?`;
    // `SELECT * FROM posts WHERE posts.id = ?`;
    mysql.query(sqlGetPost, [postId], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            console.log("pas de post à l'id : " + postId);
            return res.status(400).json({
                message: "Pas de publication à cette adresse !"
            });
        }
        res.status(200).json(result);
    });
}

// créer une publi ==> OK
exports.createPost = (req, res, next) => {
    const token = Utils.getReqToken(req);
    const userId = token.userId;
    const textContent = req.body.textContent;

    let textContentChecking = (textContent === "" || textContent === null || textContent === undefined);
    let sqlCreatePost;
    let values;
    let message;

    if (!req.file && textContentChecking) { // publi vide
        return res.status(400).json({
            message: "vous ne pouvez pas envoyer une publication sans texte ou sans visuel"
        });
    };
    if (!req.file && !textContentChecking) { // publication texte only
        values = [textContent, userId];
        sqlCreatePost = "INSERT INTO posts (content, date, id_user) VALUES (?, NOW(), ?)";
        message = "Publication texte créée !";
    }
    if (req.file) { // si visuel test si texte ou non
        const visualContent = `${req.protocol}://${req.get("host")}/fichiers/${req.file.filename}`;
        if (textContentChecking) { // pas de texte
            values = [visualContent, userId];
            sqlCreatePost = "INSERT INTO posts (visualContent, date, id_user) VALUES (?, NOW(), ?)";
            message = "Publication visuel only créée !";
        };
        if (!textContentChecking) { // texte et visuel
            values = [textContent, visualContent, userId];
            sqlCreatePost = "INSERT INTO posts (content, visualContent, date, id_user) VALUES (?, ?, NOW(), ?)";
            message = "Publication avec visuel et texte créée !";
        };
    };
    mysql.query(sqlCreatePost, values, function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        res.status(201).json({
            message
        });
    });
}

// suppression d'une publi ==> ok
exports.deleteOnePost = (req, res, next) => {
    const postId = req.params.id;
    const token = Utils.getReqToken(req);
    const userId = token.userId;
    const isAdmin = token.isAdmin;
    console.log('userId : ' + userId + " isAdmin : " + isAdmin)
    let sqlDeletePost;
    let sqlSelectPost = "SELECT * FROM posts WHERE id = ?";
    mysql.query(sqlSelectPost, [postId], function (err, result) {
        if (result.length == 0) {
            return res.status(400).json({
                message: "Pas de publication à cette adresse."
            });
        };
        if (userId === result[0].id_user || isAdmin) {
            console.log("l'utilisateur peut supprimer ce post")
            if (err) {
                return res.status(500).json(err.message);
            };
            if (result[0].visualContent != null) { //if req.file : suppression image et ensuite mysql.query
                const filename = result[0].visualContent.split("/fichiers/")[1];
                console.log(filename);
                fs.unlink(`fichiers/${filename}`, (err => {
                    if (err) {
                        return res.status(500).json(err.message);
                    };
                    // console.log("fichier suppr");
                    sqlDeletePost = "DELETE FROM posts WHERE id_user = ? AND id = ?"
                }));
            } else {
                // console.log('pas de fichier ')
                sqlDeletePost = "DELETE FROM posts WHERE id_user = ? AND id = ?";
            }
            mysql.query(sqlDeletePost, [userId, postId], function (err, result) {
                if (err) {
                    return res.status(500).json(err.message);
                };
                res.status(200).json({
                    message: "Publication supprimée !"
                });
            });
        } else {
            return res.status(403).json({
                message: "vous ne pouvez pas supprimer un post dont vous n'êtes pas l'auteur"
            });
        }
    });
}

// PARTAGES
// fonction pour afficher ttes les publications partagées
// exports.getAllSharedPosts = (req, res, next)=>{
//     console.log("affiche tous les partages")
// }

// fonction pour partager une publi = ok
exports.sharePost = (req, res, next) => {
    const postId = req.params.id;
    const token = Utils.getReqToken(req);
    const userId = token.userId;

    let sqlSharePost = "INSERT INTO share (id_user, id_post, share_date) VALUES (?, ?, NOW())";
    let values = [userId, postId];
    mysql.query(sqlSharePost, values, function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        res.status(201).json({
            message: "Publication partagée !"
        });
    });
}

// COMMENTAIRES
//fonction pour commenter
exports.createComment = (req, res, next) => {
    const postId = req.params.id;
    const commentContent = req.body.commentContent;

    const token = Utils.getReqToken(req);
    const userId = token.userId;

    const commentChecking = (commentContent == null || commentContent == undefined || commentContent == "");
    if (commentChecking) {
        // console.log("commentaire impossible si champ de texte vide");
        return res.status(400).json({
            message: "vous ne pouvez pas parler pour ne rien dire !"
        })
    } else {
        let values = [commentContent, userId, postId]
        let sqlAddComment = `INSERT INTO comments (commentContent, date, id_user, id_post) 
        VALUES (?, NOW(), ?, ?)`;
        mysql.query(sqlAddComment, values, function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            };
            res.status(201).json({
                message: "Commentaire enregistré !"
            });
        });
    }
}

//get all comments of one post === ok
exports.getAllComments = (req, res, next) => {
    const postId = req.params.id;
    let sqlGetPost = `SELECT posts.* FROM posts WHERE posts.id = ?`;

    mysql.query(sqlGetPost, [postId], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            console.log("pas de post à l'id : " + postId);
            return res.status(400).json({
                message: "Pas de publication à cette adresse !"
            });
        }
        // res.status(200).json(result);
        console.log(result[0])
        let sqlGetComments = `SELECT comments.id, comments.commentContent, comments.date, comments.id_user, comments.id_post
        ,users.firstName, users.lastName, users.pseudo, users.profilePic
        FROM comments
        LEFT JOIN users ON users.id=comments.id_user
        WHERE comments.id_post = ?
        ORDER BY comments.id`;
        mysql.query(sqlGetComments, [postId], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            };
            if (result == 0) {
                return res.status(400).json({
                    message: "Il n'y a pas encore de commentaire sur cette publication !"
                })
            }
            console.log(result);
            return res.status(200).json(result);
        })
    });
}
// delete one comment
exports.deleteOneComment = (req, res, next) => {
    const commentId = req.params.id;
    const token = Utils.getReqToken(req);
    const userId = token.userId;
    const isAdmin = token.isAdmin;

    let sqlSelectComment = `SELECT * FROM comments WHERE id=?`;
    let sqlDeleteComment = `DELETE FROM comments WHERE id=?`
    mysql.query(sqlSelectComment, [commentId], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            return res.status(400).json({
                message: "Ce commentaire n'existe pas ou plus"
            });
        };
        if ((result[0].id_user != userId) || (!!isAdmin)) {
            return res.status(403).json({
                message: "Vous ne pouvez pas supprimer ce commentaire sans en être l'auteur ou admin !"
            });
        };
        mysql.query(sqlDeleteComment, [commentId], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            };
            return res.status(200).json({
                message: "Commentaire supprimé avec succès."
            })
        });
    });
}