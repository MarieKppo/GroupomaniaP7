const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${process.env.JWT_KEY}`);
        const userId = decodedToken.userId.JWT_KEY
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        }
        else { 
            next();
        }
    } catch (error) {
        res.status(401).json({
            error: new Error('Erreur d\'authentification')
        });
    }
};