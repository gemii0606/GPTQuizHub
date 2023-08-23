const { MongoClient, ObjectId } = require('mongodb');
const { getCurrentTime } = require('../../utils/utils');
require('dotenv').config({ path: __dirname + `/../../.env` });

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const systemPrompt = `You are a professional question teacher, 
    and you generate questions in the same language based on the primary language of the marked article above.
    Do not make up the questions`

const openaiFunctionCalling = {
    name: 'generate_questions',
    description: 'generate questions from the articles',
    parameters: {
        type: 'object',
        properties: {
            /*
            article: {
                type: "string",
                description: "Summary of the article" //, including 1 hard, 1 medium and 1 easy problem, and return it useing the quitions format."
            },
            */
            questions: {
                type: 'array',
                items: {
                    type: "object",
                    properties: {
                        difficulty: { type: "string", enum: ["easy", "medium", "hard"], description: "The level corresponding to the question" },
                        question_type: { type: "string", enum: ["multiple question"], description: "The type of the question" },
                        question: { type: "string", description: "The question" },
                        question_options: {
                            type: "array", items: {
                                type: "string"
                            }, description: "options of the questions, mostly 4"
                        },
                        explanation: { type: "string", description: "The explanation of the correct answer." },
                        correct_answer: { type: "number", description: "The currect option of the  question." }
                    }
                }
            }

        },
        required: ['questions']
    }
}

async function generate_questions(questions) {
    return questions;
}

const gptfunctioncall = async (req, res) => {
    console.log('here is gpt');

    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB in gpt');
    const db = client.db(dbName);
    let insertQuizId;
    try {
        const user_id = new ObjectId(req.body.user_id);
        const article = req.body.article;
        const total = req.body.total;
        insertQuizId = new ObjectId(req.body.insertQuiz.insertedId);

        console.log("1")
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-0613",
            // max_tokens: 128,
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: `
                        Article: ${article.content}
                        '''
                        幫我針對這篇文章的內容出一份測驗，總共${total}題選擇題，一題4個選項。${article.hard}題困難，${article.easy}題簡單，${article.normal}題普通
                    `
                }
            ],
            functions: [openaiFunctionCalling]
        });
        console.log("2")
        console.log(completion.data.choices[0].message.function_call.arguments)
        const gptResult = JSON.parse(completion.data.choices[0].message.function_call.arguments);
        console.log(gptResult)

        if (!gptResult) {
            const updateQuiz = await quizzesCollection.updateOne({ _id: insertQuizId }, { $set: { status: 'failed' } });
            res.status(500).json({ error: 'The json strucure generated from gpt is not a valid one, please try again' });
            return
        }

        if (article.tag) {
            const usersCollection = db.collection('users');
            const insertTag = await usersCollection.updateOne({ _id: user_id }, { $addToSet: { tags: article.tag } });
        }

        const questionsList = gptResult.questions.map(obj => {
            const result = {
                user_id: user_id,
                quiz_id: insertQuizId,
                question: obj.question,
                type: obj.question_type,
                difficulty: obj.difficulty,
                options: obj.question.question_options,
                correct_answer: obj.correct_answer + 1,
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
        console.log("An error has occur")
        if (insertQuizId) {
            const quizzesCollection = db.collection('quizzes');
            const updateQuiz = await quizzesCollection.updateOne({ _id: insertQuizId }, { $set: { status: 'failed' } });
        }
        console.log(error);
        res.status(500).json({ error: "gpt failed." })
    } finally {
        console.log('gpt client close')
        await client.close();
    }
}

module.exports = {
    gptfunctioncall
}






