const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + `/../../.env` });
const salt = process.env.SALT;
const secret = process.env.HIDDEN_SECRET;

function isValidEmail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email))
        return false;
    return true;
}

function hashPassword(password) {
    return bcrypt.hashSync(password, salt);
}

function generateToken(user) {
    return jwt.sign(user, secret);
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (err) {
        return null; // Token is invalid or expired
    }
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

function decodejsonBase64(token) {
    const decodedObj = JSON.parse(atob(token));
    // console.log(decodedObj);
    return decodedObj;
}

function encodejsonBase64(obj) {
    const encodedObj = btoa(JSON.stringify(obj));
    return encodedObj;
}

module.exports = {
    isValidEmail,
    hashPassword,
    generateToken,
    verifyToken,
    generateRandomString,
    decodejsonBase64,
    encodejsonBase64
};