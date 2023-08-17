const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser());

// middleware
const { authAccessToken } = require('../middleware/authAccessToken');

//users
const { signIn } = require('../controllers/users/signIn');
const { signUp } = require('../controllers/users/signup');

const { articleDetail } = require('../controllers/articles/articleDetail');

const { quizCreate } = require('../controllers/quizzes/quizCreate');
const { quizDetail } = require('../controllers/quizzes/quizDetail');

router.post('/users/signup', signUp)
router.post('/users/signin', signIn);

router.get('/articles/:id', authAccessToken, articleDetail)

router.post('/quizzes/create', authAccessToken, quizCreate)
router.get('/quizzes/:id', authAccessToken, quizDetail)

module.exports = router;

