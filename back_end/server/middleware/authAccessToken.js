const { verifyToken } = require('../utils/utils');

function authAccessToken(req, res, next) {
    if (!('authorization' in req.headers) || req.headers['authorization'] === '' || req.headers['authorization'].split(' ').length < 2) {
        res.status(401).json({ error: "You are not signed in." });
    } else if (!verifyToken(req.headers['authorization'].split(' ')[1])) {
        res.status(403).json({ error: "Token is not valid" });
    } else {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = verifyToken(token);
        req.signInId = decoded.id;
        next()
    }
}

module.exports = {
    authAccessToken
};