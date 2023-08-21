const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser());

// middleware
const { authAccessToken } = require('../middleware/authAccessToken');

//users
const { signIn } = require('../controllers/users/signIn');
const { signUp } = require('../controllers/users/signUp');

//quizzes
const { gptquizgenerator } = require('../controllers/quizzes/gptgenerator');
const { quizGenerate } = require('../controllers/quizzes/quizGenerate_test');
const { quizList } = require('../controllers/quizzes/quizList');
const { quizCreate } = require('../controllers/quizzes/quizCreate');
const { quizDetail } = require('../controllers/quizzes/quizDetail');
const { quizStatusCheck } = require('../controllers/quizzes/quizStatusCheck');
const { quizDelete } = require('../controllers/quizzes/quizDelete');

const { quizHistoryCreate } = require('../controllers/quizzes/quizHistoryCreate');
const { quizHistoryList } = require('../controllers/quizzes/quizHistoryList');

//articles
const { articlesList } = require('../controllers/articles/articlesList');
const { articleDetail } = require('../controllers/articles/articleDetail');
const { articleDelete } = require('../controllers/articles/articleDelete');

const { questionEdit } = require('../controllers/questions/questionEdit');
const { questionDelete } = require('../controllers/questions/questionDelete');

router.post('/users/signUp', signUp)
router.post('/users/signin', signIn);


router.post('/quizzes/test', quizGenerate)
router.get('/quizzes/search', authAccessToken, quizList)
router.post('/quizzes/create', authAccessToken, quizCreate)

router.post('/quizzes/history', authAccessToken, quizHistoryCreate)
router.get('/quizzes/history', authAccessToken, quizHistoryList)

router.get('/quizzes/:id/check', authAccessToken, quizStatusCheck)
router.get('/quizzes/:id/detail', authAccessToken, quizDetail)
router.delete('/quizzes/:id/detail', authAccessToken, quizDelete)

router.get('/articles/search', authAccessToken, articlesList)
router.get('/articles/:id', authAccessToken, articleDetail)
router.delete('/articles/:id', authAccessToken, articleDelete)

router.put('/questions/:id', authAccessToken, questionEdit)
router.delete('/questions/:id', authAccessToken, questionDelete)

router.post('/gptquizgenerator', gptquizgenerator )

module.exports = router;

