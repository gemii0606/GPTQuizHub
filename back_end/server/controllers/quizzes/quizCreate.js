const { MongoClient, ObjectId } = require('mongodb');
const { getCurrentTime } = require('../../utils/utils');
require('dotenv').config({ path: __dirname + `/../../.env` });
const axios = require('axios');


const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const quizCreate = async (req, res) => {
    const user_id = new ObjectId(req.signInId);
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
            title: article.title,
            tag: article.tag,
            content: article.content,
            is_deleted: "false",
            status: "pending",
            created_at: getCurrentTime()
        });

        const data = {
            user_id: req.signInId,
            article,
            total,
            insertQuiz
        }
        
        const ans = await quizzesCollection.findOne({_id:data.insertQuiz.insertedId});
        console.log(ans)
        const updateQuiz = await quizzesCollection.updateOne({ _id: data.insertQuiz.insertedId }, { $set: { status: 'ok' } });
        const ans2 = await quizzesCollection.findOne({_id:data.insertQuiz.insertedId});
        console.log(ans2)


        axios.post('https://13.210.26.62/api/1.0/gptquizgenerator', data, { timeout: 120000 });

        console.log('gptres')
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
        console.log('client close')
        await client.close();
    }
}

module.exports = {
    quizCreate
  };
