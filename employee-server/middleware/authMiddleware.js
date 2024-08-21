const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/env-helper');
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) throw new Error('Access denied')
    try {
        const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error('Error:', err.stack);
        throw new Error("Login Session has been expired ! Please Login again to continue")
    }
};

module.exports = verifyToken;