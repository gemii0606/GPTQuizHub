const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser());

// middleware
const { authAccessToken } = require('../middleware/authAccessToken');

//users
const { signIn } = require('../controllers/users/signIn');
const { signUp } = require('../controllers/users/signup');
const { quizGenerate } = require('../controllers/quizzes/quizGenerate_test');
const { quizList } = require('../controllers/quizzes/quizList');

router.post('/users/signup', signUp)
router.post('/users/signin', signIn);

router.post('/quizzes/test', quizGenerate)
router.post('/quizzes/search', authAccessToken, quizList)

module.exports = router;

