//fonctions applicables à la route utilisateur = logique métier
//connecter à la bdd pour pouvoir effectuer les requetes suivantes 
//connexion bdd

//sign up (post)
// let sql = "CREATE TABLE  IF NOT EXISTS user (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, firstname VARCHAR(100) NOT NULL,    email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(100) NOT NULL, pseudo VARCHAR(100) DEFAULT NULL, #id_authority INTEGER DEFAULT NULL)";
// groupomania.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
// });

// let signUpSql = "INSERT INTO user (name, firstname, email, password, pseudo) VALUES ('Bernard', 'Dupont', 'bernard@gmail.com', 'bebermdp', 'Beber')";
//remplacer values par variables récup du form
// groupomania.query(signUpSql, function (err, result) {
//     if (err) throw err;
//     console.log("1 user added");
// });

//login (get)
//SELECT * FROM user WHERE id = tokenId JOIN post ON user.id_user = post.id_user

//to modify (put)
//UPDATE user SET 'password' = 'newpassword' WHERE 'id_user' = 'token.id_user';

//to delete (delete)
//DELETE * FROM user WHERE 'id_user' =  'token.id_user';