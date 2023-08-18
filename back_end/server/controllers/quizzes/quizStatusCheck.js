const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: __dirname + `/../../.env` });


const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const quizStatusCheck = async (req, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        const user_id = new ObjectId(req.signInId);
        const quiz_id = new ObjectId(req.params.id);
 
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);

        const quizzesCollection = db.collection('quizzes');
        const findQuiz = await quizzesCollection.findOne({ _id: quiz_id });

        res.status(200).json({
            data: {
                quiz: {
                    id: quiz_id,
				    status: findQuiz.status
                }
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
    quizStatusCheck
  };