// //modèle de données pour user
const groupomania = require('./Database');

//création de l'objet utilisateur 
const User = function(user) {
    this.name = user.name,
    this.firstname = user.firstname,
    this.email = user.email, //unique ?
    this.password = user.password,
    this.profilePic = user.profilePic, 
    this.authority = user.authority
};

//ajouter création d'un user

module.exports = User;