const env = require("../environnement"); // récup variables!
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    console.log('headers : ')
    console.log(req.headers.authorization)

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, `${process.env.TOKEN_KEY}`);
    const userId = decodedToken.userId;
    console.log('token : ' + token)

    console.log('test userId auth : ' + userId);
    
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
//     try {
//         console.log("test 1");
//         const token = req.headers.authorization.split(' ')[1]; //fonctionne pas
//         const decodedToken = jwt.verify(token, env.token);
//         res.locals.userId = decodedToken.userId;
//         console.log('test 2');
//         next();
//     } catch (error) {
//         res.status(401).json({
//             error: new Error('Erreur d\'authentification')
//         });
//     }
// };