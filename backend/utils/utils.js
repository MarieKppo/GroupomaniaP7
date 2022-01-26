const jwt = require('jsonwebtoken'); 
const Utils = function () {};

// récupérer les infos du token 
Utils.getReqToken = (req) => {
  const token = req.headers.authorization.split(' ')[1];                    
  const decodedToken = jwt.verify(token, `${process.env.TOKEN_KEY}`);        
  return decodedToken;
}  

module.exports = Utils;