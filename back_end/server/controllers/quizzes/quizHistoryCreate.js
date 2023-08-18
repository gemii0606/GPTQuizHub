const { MongoClient, ObjectId } = require('mongodb');
const { getCurrentTime } = require('../../utils/utils');

const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const quizHistoryCreate = async (req, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        const signInId = new ObjectId(req.signInId);
        await client.connect();
        const db = client.db(dbName);
        const quizzesHistoryCollection = db.collection('quizzesHistory');

        const newQuizHistory = {
            quiz_id: new ObjectId(req.body.quiz_id),
            user_id: signInId,
            accuracy: req.body.accuracy,
            wrongAnswer: req.body.wrongAnswer,
            created_at: getCurrentTime()
        }

        const insertResult = await quizzesHistoryCollection.insertOne(newQuizHistory);
        
        res.status(200).json({
            data:{
                quizHistory:{
                    id: insertResult.insertedId
                }
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error." })
    } finally {
        await client.close();
    }
}

module.exports = {
    quizHistoryCreate
}