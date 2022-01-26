// modules
const mysql = require('../Database').connection;
const bcrypt = require('bcrypt'); //hacher le mdp
const jwt = require('jsonwebtoken'); //token sécu
const fs = require("fs"); // Permet de gérer les fichiers stockés
const Utils = require("../utils/utils"); //importe la fonction pour décoder le token

// fonction pour afficher tous les posts //ajouter les partages ! + ajouter conditions que l'user ait un compte ?
exports.getAllPosts = (req, res, next) => {
    let sqlGetAllPosts = `SELECT posts.id AS 'postId',
    posts.content AS 'contenu publication', 
    posts.date AS 'date publication'
    FROM posts   
    ORDER BY posts.date LIMIT 15`; 
    // get all posts join to users name and cie
    // sqlGetAllPosts = `SELECT posts.id, posts.content, posts.visualContent, posts.date, posts.id_user,
    // users.firstName, users.lastName, users.pseudo, users.profilePic, comments.commentContent, comments.date, comments.id_user, comments.id_post
    // FROM posts
    // LEFT JOIN users ON users.id = posts.id_user
    // left JOIN comments ON comments.id_post=posts.id
    // ORDER BY posts.date limit 15`;
    mysql.query(sqlGetAllPosts, function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            return res.status(400).json({ message: "Pas de publications à afficher !" });
        }
        res.status(200).json(result);
        console.log("nombre de posts et de partages : " + result.length)
    });
}

// fonction pour afficher les posts d'un user (ajouter partage + vérif si user existe ?) 
exports.getAllPostsOfUser = (req, res, next) => {
    const userId = req.params.id;

    let sqlGetAllPosts = `SELECT posts.id AS 'post id',
    users.id AS 'userId',
    posts.content AS 'contenu publication', 
    posts.date AS 'date publication'
    FROM users, posts WHERE users.id = posts.id_user AND users.id = ?
    ORDER BY posts.date LIMIT 20`; 
    // get all post d'un user + les commentaires s'ils existent 
    // 'SELECT posts.id, posts.content, posts.visualContent, posts.date, posts.id_user,
    // users.firstName, users.lastName, users.pseudo, users.profilePic,
    // comments.commentContent, comments.date, comments.id_user, comments.id_post
    // FROM posts
    // LEFT JOIN users ON users.id = posts.id_user
    // LEFT JOIN comments ON comments.id_post=posts.id
    // // #ORDER BY posts.date
    // WHERE posts.id_user= ?'
    mysql.query(sqlGetAllPosts, [userId], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            return res.status(400).json({ message: "Pas de publications à afficher pour cet utilisateur !" });
        }
        console.log("nombre de posts et de partages : " + result.length)
        res.status(200).json(result);
    });
}

// fonction recup une publi //done
exports.getOnePost = (req, res, next) => {
    const postId = req.params.id;

    let sqlGetPost = `SELECT * FROM posts WHERE posts.id = ?`;
    mysql.query(sqlGetPost, [postId], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            console.log("pas de post à l'id : " + postId);
            return res.status(400).json({ message: "Pas de publication à cette adresse !" });
        }
        res.status(200).json(result);
    });
}

// créer une publi ==> OK
exports.createPost = (req, res, next) => {
    const token = Utils.getReqToken(req);
    const userId = token.userId;
    console.log(userId)
    
    const textContent = req.body.textContent;
    const visualContent = req.body.filename;// `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    console.log("text content : "+textContent+ " // visual content : "+visualContent)
    let textContentChecking = textContent === "" || textContent === null || textContent === undefined;
    let visualContentChecking = visualContent === "" || visualContent === null || visualContent === undefined;
    let sqlCreatePost;
    let values;
    let message;

    // si zones de texte et d'image sont vides : publication impossible
    if (textContentChecking && visualContentChecking) {
        return res.status(400).json({message: "vous ne pouvez pas envoyer une publication sans texte ou sans visuel"})
    }
    // si zone d'image vide : publication texte seulement
    if (visualContentChecking && !textContentChecking){
        values = [textContent, userId];
        sqlCreatePost = "INSERT INTO posts (content, date, id_user) VALUES (?, NOW(), ?)";
        message = "Publication texte créée !";
    }
    // si zone de texte vide : publication d'image seulement
    if (textContentChecking && !visualContentChecking){
        values = [visualContent, userId];
        sqlCreatePost = "INSERT INTO posts (visualContent, date, id_user) VALUES (?, NOW(), ?)";
        message = "Publication visuel only créée !";
    }
    // si zones texte et image complétées (!= vides) : publication texte et image  
    if (!textContentChecking && !visualContentChecking){
        values = [textContent, visualContent, userId];
        sqlCreatePost = "INSERT INTO posts (content, visualContent, date, id_user) VALUES (?, ?, NOW(), ?)";
        message = "Publication avec visuel et texte créée !" ;
    }
    mysql.query(sqlCreatePost, values, function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        res.status(201).json({ message });
    });

}

// suppression d'une publi ==> OK (ajouter suppression des commentaires de cette publi)
exports.deleteOnePost = (req, res, next) => { 
    const postId = req.params.id;
    const token = Utils.getReqToken(req);
    const userId = token.userId;
    const isAdmin = token.isAdmin;

    let sqlDeletePost;
    let sqlSelectPost = "SELECT * FROM posts WHERE id = ?";
    mysql.query(sqlSelectPost, [postId], function (err, result) {
        // console.log("mysql select post avec id : " + postId)
        // console.log(result[0])
        if (result.length==0){
            return res.status(400).json({message:"Pas de publication à cette adresse."});
        };
        if (userId === result[0].id_user || isAdmin) {
            // console.log("l'utilisateur peut supprimer ce post")
            if (err) {
                return res.status(500).json(err.message);
            };     
            if (result > 0) {
                const filename = result[0].visualContent; //.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => { // On supprime le fichier image en amont
                    sqlDeletePost = "DELETE FROM posts WHERE id_user = ? AND id = ?";
                    mysql.query(sqlDeletePost, [userId, postId], function (err, result) {
                        if (err) {
                            return res.status(500).json(err.message);
                        };
                        res.status(200).json({ message: "Publication effacée !" });
                    });
                })
            } else {
                sqlDeletePost = "DELETE FROM posts WHERE id_user = ? AND id = ?";
                mysql.query(sqlDeletePost, [userId, postId], function (err, result) {
                    if (err) {
                        return res.status(500).json(err.message);
                    };
                    res.status(200).json({ message: "Publication supprimée !" });
                });
            }
        } else {
            return res.status(403).json({message : "vous ne pouvez pas supprimer un post dont vous n'êtes pas l'auteur"});
        }

    });
}

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
        res.status(201).json({ message: "Publication partagée !" });
    });
}

// logique commentaires
//fonction pour commenter
exports.createComment = (req, res, next) => {
    const postId= req.params.id;
    const commentContent = req.body.commentContent;

    const token = Utils.getReqToken(req);
    const userId = token.userId;

    const commentChecking = (commentContent == null || commentContent == undefined || commentContent == "");
    if (commentChecking){
        // console.log("commentaire impossible si champ de texte vide");
        return res.status(400).json({message : "vous ne pouvez pas parler pour ne rien dire !"})
    }
    else {
        let values = [commentContent, userId, postId]
        let sqlAddComment = `INSERT INTO comments (commentContent, date, id_user, id_post) 
        VALUES (?, NOW(), ?, ?)`;
        mysql.query(sqlAddComment, values, function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            };
            res.status(201).json({message: "Commentaire enregistré !" });
        });
    }
}

// delete one comment
exports.deleteOneComment = (req, res, next) => {
    const commentId= req.params.id;
    const token = Utils.getReqToken(req);
    const userId = token.userId;
    const isAdmin = token.isAdmin;

    let sqlSelectComment = `SELECT * FROM comments WHERE id=?`;
    let sqlDeleteComment = `DELETE FROM comments WHERE id=?`
    mysql.query(sqlSelectComment, [commentId], function (err, result){
        if(err) {
            return res.status(500).json(err.message);
        };
        if(result.length == 0){
            return res.status(400).json({message : "Ce commentaire n'existe pas ou plus"});
        };
        if((result[0].id_user != userId) || (!!isAdmin)){
            return res.status(403).json({message:"Vous ne pouvez pas supprimer ce commentaire sans en être l'auteur ou admin !"});
        };
        mysql.query(sqlDeleteComment, [commentId], function(err, result){
            if(err){
                return res.status(500).json(err.message);
            };
            return res.status(200).json({message:"Commentaire supprimé avec succès."})
        });
    });
}