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
     "question": "小梅當選班花的原因是什麼？",
     "options":
       [ "她比其他女生漂亮",
       "她發表了精彩的演說",
       "她比其他女生更有才華",
       "她讓其他女生感到自信" ],
     "correct_answer": 1,
     "explanation": "小梅的演說讓其他女生覺得因為有她，她們變得更優秀，所以她被選為班花。"
     }]
 }

const quizCreate = async (req, res) => {
    const user_id = req.signInId;
    const article = req.body.article;

    const client = new MongoClient(url, { useUnifiedTopology: true });
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
        quiz_id: insertQuiz,insertedId,
        title: article.title, 
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
                  幫我針對這篇文章的內容出一份測驗，總共5題選擇題，一題4個選項。2題困難，1題簡單，2題普通，每一題要標註題目難易度和題型和正確答案和答案解釋。回答語言請與輸入的語言相同。不要其他多餘的回答。
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

    return res.status(200).json({
        data: {
          quiz: {id: insertQuiz.insertedId},
        },
      });

}

module.exports = {
    quizCreate
  };
