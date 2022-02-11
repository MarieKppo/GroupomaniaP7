//import de modules
const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

//importation des routes 
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

//middlewares
const morgan = require('morgan');
const favicon = require('serve-favicon');

//middlewares : morgan pour phase de developpement + favicon 
app
.use(favicon(__dirname + '/icon.png')) //favicon logo groupomania
.use(morgan('dev'))

//CORS : traitement erreurs et ajout d'headers à supprimer après import de cors
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost/8080');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(helmet());
app.use(cors({origin:true}));
app.use((req, res, next) => { // cross origin policy pour permettre le get et read des images sur cross origin (ports différents)
	res.header("Cross-Origin-Resource-Policy", "cross-origin");
	next();
  });

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/fichiers', express.static(path.join(__dirname, 'fichiers'))); 
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

//verification champ d'erreur / multer
// app.use((error, req, res, next)=> {
//   const message = `this is the unexpected field -> "${error.field}`;
//   console.log(message);
//   return res.status(500).send(message);
// })
//export app à la fin du fichier
module.exports = app;