//import de modules
const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

//middlewares
const morgan = require('morgan');
const favicon = require('serve-favicon');

//middlewares : morgan pour phase de developpement + favicon 
app
.use(favicon(__dirname + '/icon.png')) //favicon logo groupomania
.use(morgan('dev'))

//Traitement des headers
app.use(helmet());
app.use(cors({origin:true}));
app.use((req, res, next) => { // cross origin policy pour permettre le get et read des images sur cross origin (ports différents)
	res.header("Cross-Origin-Resource-Policy", "cross-origin");
	next();
}); // ou app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/fichiers', express.static(path.join(__dirname, 'fichiers'))); 
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;