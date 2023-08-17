const { MongoClient } = require('mongodb');
const { getCurrentTime } = require('../../utils/utils');
require('dotenv').config({ path: __dirname + `/../../.env` });


const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    });
const openai = new OpenAIApi(configuration);

const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const requestJson = (prompt, jsonStructure) => `${prompt}
  Do not include any explanations, only provide a RFC8259 compliant JSON response following this format without deviation.
  ${JSON.stringify(jsonStructure, null, 2)}, do not generate id for each question`;

  const template = {
    "questions": [{
     "difficulty": "easy, medium, difficult",
     "type": "multiple questions",
     "question": "question",
     "options":
       [ "option",
       "option",
       "option",
       "option" ],
     "correct_answer": 1,
     "explanation": "explanation"
     }]
 }

const quizCreate = async (req, res) => {
    const user_id = req.signInId;
    const article = req.body.article;
    const total = ['easy', 'normal', 'hard'].reduce((sum, key) => sum + parseInt(article[key]), 0);

    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);

        const quizzesCollection = db.collection('quizzes');
        const insertQuiz = await quizzesCollection.insertOne({ 
            user_id: user_id,
            status: "pending",
            created_at: getCurrentTime()
        });

        const articlesCollection = db.collection('articles');
        const insertArticle = await articlesCollection.insertOne({ 
            user_id: user_id,
            quiz_id: insertQuiz.insertedId,
            title: article.title, 
            category: article.category,
            content: article.content, 
            created_at: getCurrentTime()
        });

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            // max_tokens: 128,
            messages: [
                {role: "system", content: "你是位專業的出題老師"},
                {
                role: "user", 
                content: requestJson(
                    `
                    ${article}
                    :::
                    幫我針對這篇文章的內容出一份測驗，總共${total}題選擇題，一題4個選項。${article.hard}題困難，${article.easy}題簡單，${article.normal}題普通，每一題要標註題目難易度和題型和正確答案和答案解釋。回答語言請與輸入的語言相同。不要其他多餘的回答。
                    請用JSON的格式回覆我，並且有id、difficulty、type、question、options、correct_answer、explanation
                `, template)
                }
            ],
        });
        const gptResult = JSON.parse(completion.data.choices[0].message?.content);

        const questionsList = gptResult.questions.map(obj => {
            const result = {
                user_id: user_id,
                quiz_id: insertQuiz.insertedId, 
                question: obj.question,
                type: obj.type,
                difficulty: obj.difficulty,
                options: obj.options,
                correct_answer: obj.correct_answer,
                explanation: obj.explanation,
                created_at: getCurrentTime()
            };
            return result;
        });

        const questionsCollection = db.collection('questions');
        const insertQuestion = await questionsCollection.insertMany(questionsList);

        const updateQuiz = await quizzesCollection.updateOne({ _id: insertQuiz.insertedId }, { $set: { status: 'ok' } });
        console.log('1')
        res.status(200).json({
            data: {
                quiz: {id: insertQuiz.insertedId}
            }
        });
        return
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error." })
    } finally {
        console.log('2')
        await client.close();
    }
}

module.exports = {
    quizCreate
  };
