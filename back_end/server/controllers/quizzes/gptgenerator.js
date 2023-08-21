const { MongoClient, ObjectId } = require('mongodb');
const { getCurrentTime } = require('../../utils/utils');
require('dotenv').config({ path: __dirname + `/../../.env` });

const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const requestJson = (prompt, jsonStructure) => `${prompt}
  Do not include any explanations, only provide a RFC8259 compliant JSON response following this format without deviation.
  ${JSON.stringify(jsonStructure, null, 2)}, do not generate id for each question`;

const template = {
    "questions": [{
     "difficulty": "easy, normal, hard",
     "type": "multiple questions",
     "question": "question",
     "options":
       [ "option",
       "option",
       "option",
       "option" ],
     "correct_answer": "1, 2, 3, 4 (be a number)",
     "explanation": "explanation"
     }]
 }

const gptquizgenerator = async (req, res) => {
    console.log('here is gpt');

    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        const { Configuration, OpenAIApi } = require("openai");
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
            });
        const openai = new OpenAIApi(configuration);

        const user_id = new ObjectId(req.body.user_id);
        const article = req.body.article;
        const total = req.body.total;
        const insertQuizId = new ObjectId(req.body.insertQuiz.insertedId);
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            // max_tokens: 128,
            messages: [
                {role: "system", content: "你是位專業的出題老師，而且你是根據'''標記以上文章的主要語言來出同樣語言的題目"},
                {
                role: "user", 
                content: requestJson(
                    `
                    ${article.content}
                    '''
                    幫我針對這篇文章的內容出一份測驗，總共${total}題選擇題，一題4個選項。${article.hard}題困難，${article.easy}題簡單，${article.normal}題普通，每一題要標註題目難易度和題型和正確答案和答案解釋。回答語言請與輸入的語言相同。不要其他多餘的回答。
                    請用JSON的格式回覆我，並且有id、difficulty、type、question、options、correct_answer、explanation
                `, template)
                }
            ],
        });

        const gptResult = JSON.parse(completion.data.choices[0].message?.content);
        if (!gptResult) {
            const updateQuiz = await quizzesCollection.updateOne({ _id: insertQuizId }, { $set: { status: 'failed' } });
            res.status(500).json({ error: 'The json strucure generated from gpt is not a valid one, please try again' });
            return 
        }

        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        
        if (article.tag) {
            const usersCollection = db.collection('users');
            const insertTag = await usersCollection.updateOne({ _id: user_id }, { $push: { tags: article.tag } });
        }

        const questionsList = gptResult.questions.map(obj => {
            const result = {
                user_id: user_id,
                quiz_id: insertQuizId, 
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
        console.log('question ok')

        const quizzesCollection = db.collection('quizzes');
        const updateQuiz = await quizzesCollection.updateOne({ _id: insertQuizId }, { $set: { status: 'ok' } });
        console.log('quiz ok')
        res.status(200).json({ message: "gptquizgenerator completed successfully." });

    } catch (error) {
        const updateQuiz = await quizzesCollection.updateOne({ _id: insertQuizId }, { $set: { status: 'failed' } });
        console.log(error);
        res.status(500).json({ error: "gpt failed." })
    } finally {
        console.log('gpt client close')
        await client.close();
    }
}

module.exports = {
    gptquizgenerator
  };