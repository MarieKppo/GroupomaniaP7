// modules
const mysql = require('../Database').connection;
const fs = require("fs"); // Permet de gérer les fichiers stockés

// fonction pour afficher tous les posts
exports.getAllPosts = (req, res, next) => {
    const userId = res.locals.userId;

    let sqlGetPosts;

    sqlGetPosts = `SELECT users.id, posts.id AS 'post id', posts.date AS 'post date', share.id_post AS 'share id', share.share_date
    FROM users, posts, share
    WHERE users.id = posts.id_user
    AND users.id = share.id_user 
    AND users.id = 1
    ORDER BY posts.date, share.share_date ASC LIMIT 20`;
    mysql.query(sqlGetPosts, userId, function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            return res.status(400).json({ message: "Pas de publications à afficher !" });
        }
        res.status(200).json(result);
    });
}

// fonction recup une publi
exports.getOnePost = (req, res, next) => {
    const userId = res.locals.userId;
    const postId = req.params.id;

    let sqlGetPost;

    sqlGetPost = `SELECT users.id, posts.id AS 'post id', posts.date AS 'post date', share.id_post AS 'share id', share.share_date
    FROM users, posts, share
    WHERE posts.id = postsId`;
    mysql.query(sqlGetPost, userId, postId, function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            return res.status(400).json({ message: "Pas de publication à afficher !" });
        }
        res.status(200).json(result);
    });
}

// créer une publi
exports.createPost = (req, res, next) => {
    const userID = res.locals.userId;
    const legend = req.body.textContent;
    const gifUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    console.log(urlContent);
    console.log(req.file.filename)

    let sqlCreatePost;
    let values;

    sqlCreatePost = "INSERT INTO posts VALUES (NULL, ?, ?, ?, NULL, NULL, NOW())";
    values = [userId, textContent, urlContent];
    mysql.query(sqlCreatePost, values, function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        res.status(201).json({ message: "Post crée !" });
    });
}

// suppression d'une publi
exports.deleteOnePost = (req, res, next) => {
    const postID = req.params.id;
    const userID = res.locals.userId;

    let sqlDeletePost;
    let sqlSelectPost;

    sqlSelectPost = "SELECT urlContent FROM posts WHERE postId = ?";
    mysql.query(sqlSelectPost, [postID], function (err, result) {
        if (result > 0) {
            const filename = result[0].gifUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => { // On supprime le fichier image en amont
                sqlDeletePost = "DELETE FROM posts WHERE userId = ? AND postId = ?";
                mysql.query(sqlDeletePost, userId, postId, function (err, result) {
                    if (err) {
                        return res.status(500).json(err.message);
                    };
                    res.status(200).json({ message: "Publication effacée !" });
                });
            })
        } else {
            sqlDeletePost = "DELETE FROM posts WHERE userId = ? AND postId = ?";
            mysql.query(sqlDeletePost, userId, postId, function (err, result) {
                if (err) {
                    return res.status(500).json(err.message);
                };
                res.status(200).json({ message: "Publication supprimée !" });
            });
        }
        if (err) {
            return res.status(500).json(err.message);
        };


    });
}

// fonction pour commenter
exports.sharePost = (req, res, next) => {
    const postId = req.params.id;
    const userId = res.locals.userId;
    const body = req.body.body;

    let sqlSharePost;
    let values;

    sqlSharePost = "INSERT INTO comments VALUES (NULL, ?, ?, NOW())";
    values = [userId, postId];
    mysql.query(sqlSharePost, values, function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        res.status(201).json({ message: "Publication partagée!" });
    });
}
