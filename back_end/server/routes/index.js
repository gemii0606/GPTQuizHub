const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser());

// middleware
const { authAccessToken } = require('../middleware/authAccessToken');

//users
const { signIn } = require('../controllers/users/signIn');
const { signUp } = require('../controllers/users/signup');

//quizzes
const { quizGenerate } = require('../controllers/quizzes/quizGenerate_test');
const { quizList } = require('../controllers/quizzes/quizList');

//articles
const { articlesList } = require('../controllers/articles/articlesList');
const { articleDetail } = require('../controllers/articles/articleDetail');

const { quizCreate } = require('../controllers/quizzes/quizCreate');
const { quizDetail } = require('../controllers/quizzes/quizDetail');

router.post('/users/signup', signUp)
router.post('/users/signin', signIn);

router.post('/quizzes/test', quizGenerate)
router.get('/quizzes/search', authAccessToken, quizList)
router.post('/quizzes/create', authAccessToken, quizCreate)
router.get('/quizzes/:id', authAccessToken, quizDetail)

router.get('/articles/search', authAccessToken, articlesList)
router.get('/articles/:id', authAccessToken, articleDetail)


module.exports = router;

