// modules
const mysql = require('../Database').connection;
const fs = require("fs"); // Permet de gérer les fichiers stockés
const Utils = require("../utils/utils"); //importe la fonction pour décoder le token

// fonction pour afficher tous les posts et partages            
exports.getAllPosts = (req, res, next) => {
    let feed = [];
    let sqlGetAllPosts = `SELECT posts.id, posts.content, posts.visualContent, posts.date, posts.id_user,
    users.firstName, users.lastName, users.pseudo, users.profilePic
    FROM posts, users
    WHERE users.id = posts.id_user
    ORDER BY posts.date LIMIT 20`;
    mysql.query(sqlGetAllPosts, function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            return res.status(400).json({
                message: "Pas de publications à afficher !"
            });
        }
        result.forEach(element => {
            let publication = {
                shareId: null,
                postId: element.id,
                userId: element.id_user,
                date: element.date, //ajouter un script
                pseudo: element.pseudo,
                profilePic: element.profilePic,
                firstName: element.firstName,
                lastName: element.lastName,
                content: element.content,
                visualContent: element.visualContent,
                type: 'Publié',
                authorId : null,
                authorFirstName: null,
                authorLastname: null,
            }
            feed.push(publication)
        });
            let sqlGetAllSharedP = `SELECT share.id, share.share_date, share.id_user, share.id_post, 
            sharers.pseudo, sharers.profilePic, sharers.firstName, sharers.lastName,
            posts.content, posts.visualContent, posts.id_user AS 'authorId',
            writers.firstName AS 'authorFirstame', writers.lastName AS 'authorLastname'
                        FROM share, users AS sharers, posts
                        left outer JOIN users AS writers ON posts.id_user = writers.id
                        WHERE share.id_user = sharers.id 
                        AND share.id_post = posts.id
                        ORDER BY share_date LIMIT 20`;
            mysql.query(sqlGetAllSharedP, function (err, result) {
                if (err) {
                    return res.status(500).json(err.message);
                };
                console.log("resulats requete des partages : " + result.length)
                result.forEach(element => {
                    let publication = {
                        shareId: element.id,
                        postId: element.id_post,
                        userId: element.id_user,
                        date: element.share_date, 
                        pseudo: element.pseudo,
                        profilePic: element.profilePic,
                        firstName: element.firstName,
                        lastName: element.lastName,
                        content: element.content,
                        visualContent: element.visualContent,
                        type: 'Partagé',                        
                        authorId : element.authorId,
                        authorFirstName: element.authorFirstame,
                        authorLastname: element.authorLastname,
                    }
                    feed.push(publication)
                });
                feed.sort((a,b) =>  new Date(b.date) - new Date(a.date));
                return res.status(200).json(feed)
            });
    });
}

// fonction pour afficher les posts et partages d'un user  
exports.getAllPostsOfUser = (req, res, next) => {
    const userId = req.params.id;
    let userFeed = [];
    let sqlGetAllUserPosts = `SELECT posts.id, posts.content, posts.visualContent, posts.date, posts.id_user,
    users.firstName, users.lastName, users.pseudo, users.profilePic
    FROM posts, users
    WHERE users.id = posts.id_user AND users.id = ?
    ORDER BY posts.date LIMIT 20`;
    let sqlGetAllSharedPByUser = `SELECT share.id, share.id_user, share.share_date, share.id_post, 
    sharers.pseudo, sharers.profilePic, sharers.firstName, sharers.lastName,
    posts.content, posts.visualContent, posts.id_user AS 'authorId',
    writers.firstName AS 'authorFirstame', writers.lastName AS 'authorLastname'
                FROM share, users AS sharers, posts
                left outer JOIN users AS writers ON posts.id_user = writers.id
                WHERE share.id_user = sharers.id 
                AND share.id_post = posts.id
                AND sharers.id = ?
                ORDER BY share_date LIMIT 20`;

    mysql.query(sqlGetAllUserPosts, [userId], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        result.forEach(element => {
            let publication = {
                shareId: null,
                postId: element.id,
                userId: element.id_user,
                date: element.date, 
                pseudo: element.pseudo,
                profilePic: element.profilePic,
                firstName: element.firstName,
                lastName: element.lastName,
                content: element.content,
                visualContent: element.visualContent,
                type: 'Publié',                        
                authorId : null,
                authorFirstName: null,
                authorLastname: null,
            }
            userFeed.push(publication)
        });
        mysql.query(sqlGetAllSharedPByUser, [userId], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            };
            result.forEach(element => {
                let publication = {
                    shareId: element.id,
                    postId: element.id_post,
                    userId: element.id_user,
                    date: element.share_date,
                    pseudo: element.pseudo,
                    profilePic: element.profilePic,
                    firstName: element.firstName,
                    lastName: element.lastName,
                    content: element.content,
                    visualContent: element.visualContent,
                    type: 'Partagé',                        
                    authorId : element.authorId,
                    authorFirstName: element.authorFirstame,
                    authorLastname: element.authorLastname,
                }
                userFeed.push(publication)
            });
            userFeed.sort((a,b) =>  new Date(b.date) - new Date(a.date));
            if(userFeed.length != 0){
                return res.status(200).json({
                    message : " voici le contenu des posts et partages de l'user",
                    userFeed});
            }
            return res.status(400).json({message: "Cet utilisateur n'a encore rien publié ou partagé."})
        });
    });
}

// fonction recup une publi 
exports.getOnePost = (req, res, next) => {
    const postId = req.params.id;

    let sqlGetPost = `SELECT posts.id, posts.content, posts.visualContent, posts.date, posts.id_user,
    users.firstName, users.lastName, users.pseudo, users.profilePic
    FROM posts, users
    WHERE users.id = posts.id_user AND posts.id = ?`;
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

// créer une publi
exports.createPost = (req, res, next) => {
    const token = Utils.getReqToken(req);
    const userId = token.userId;
    const textContent = req.body.textContent;

    let textContentChecking = (textContent === "" || textContent === null || textContent === undefined);
    let sqlCreatePost;
    let values;
    let message;

    if (!req.file && textContentChecking) { 
        return res.status(400).json({
            message: "vous ne pouvez pas envoyer une publication sans texte ou sans visuel"
        });
    };
    if (!req.file && !textContentChecking) { 
        values = [textContent, userId];
        sqlCreatePost = "INSERT INTO posts (content, date, id_user) VALUES (?, NOW(), ?)";
        message = "Publication texte créée !";
    }
    if (req.file) { 
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
// fin fonction poster

// suppression d'une publi 
exports.deleteOnePost = (req, res, next) => {
    const postId = req.params.id;
    const token = Utils.getReqToken(req);
    const userId = token.userId;
    const isAdmin = token.isAdmin;
    let sqlSelectPost = "SELECT * FROM posts WHERE id = ?";
    let sqlDeletePost = "DELETE FROM posts WHERE id_user = ? AND id = ?";
    mysql.query(sqlSelectPost, [postId], function (err, result) {
        if (result.length == 0) {
            return res.status(400).json({
                message: "Pas de publication à cette adresse."
            });
        };
        if(userId !== result[0].id_user && isAdmin === false){
            return res.status(403).json({
                message: "vous ne pouvez pas supprimer un post dont vous n'êtes pas l'auteur, sans être admin."
            });
        }
        else {        
            if (result[0].visualContent !== null) { //if req.file : suppression image et ensuite mysql.query
                const filename = result[0].visualContent.split("/fichiers/")[1];
                fs.unlink(`fichiers/${filename}`, (err => {
                    if (err) {
                        return res.status(500).json(err.message);
                    };
                }));
            }
            mysql.query(sqlDeletePost, [result[0].id_user, postId], function (err, result) {
                if (err) {
                    console.log("l'erreur est ici" + err)
                    return res.status(500).json(err.message);
                };
                res.status(200).json({
                    message: "Publication supprimée !"
                });
            });
        } 
    });
}
// fin suppression d'une publi 

// PARTAGES
// fonction pour partager une publi
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
//fonction pour afficher un partage 
exports.getOneSharedPost = (req, res, next) => {
    const sharedId = req.params.id;
    let sqlGetOneSharedPost = `SELECT share.*, 
    posts.content, posts.visualContent 
    FROM share, posts 
    WHERE posts.id = share.id_post AND share.id = ?`;
    mysql.query(sqlGetOneSharedPost, [sharedId], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            console.log("pas de partage à l'id : " + sharedId);
            return res.status(400).json({
                message: "Pas de partage à cette adresse !"
            });
        }
        res.status(200).json(result);
    });
}
// fonction pour supprimer un partage
exports.deleteSharedPost = (req, res, next) => {
    const sharedId = req.params.id;
    const token = Utils.getReqToken(req);
    const userId = token.userId;
    const isAdmin = token.isAdmin;

    let sqlGetSharedPost = `SELECT * FROM share WHERE id = ?`   
    mysql.query(sqlGetSharedPost, [sharedId], function (err, result) {
        if (result.length == 0) {
            return res.status(400).json({
                message: "Pas de partage à cette adresse."
            });
        };
        if (userId === result[0].id_user || isAdmin) {
            if (err) {
                return res.status(500).json(err.message);
            };
            let sqlDeleteSharedPost = `DELETE FROM share WHERE share.id = ? AND share.id_user = ?`;
            mysql.query(sqlDeleteSharedPost, [sharedId, result[0].id_user], function (err, result) { 
                if (err) {
                    return res.status(500).json(err.message);
                };
                res.status(200).json({
                    message: "Partage supprimé !"
                });
            });
        } else {
            return res.status(403).json({
                message: "vous ne pouvez pas supprimer un partage dont vous n'êtes pas l'auteur"
            });
        }
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