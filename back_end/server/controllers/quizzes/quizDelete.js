const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: __dirname + `/../../.env` });


const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const quizDelete = async (req, res) => {
    const user_id = new ObjectId(req.signInId);
    const quiz_id = new ObjectId(req.params.id);

    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);

        const quizzesCollection = db.collection('quizzes');
        const deleteQuiz = await quizzesCollection.deleteOne( {_id: quiz_id } );
        if (deleteQuiz.deletedCount === 1) {
            console.log('Quiz document deleted successfully.');
        } else {
            console.log('Quiz document not found or not deleted.');
        }

        const questionsCollection = db.collection('questions');
        const deleteQuestions = await questionsCollection.deleteMany({ quiz_id: quiz_id });
        if (deleteQuestions.deletedCount > 0) {
            console.log(`${deleteQuestions.deletedCount} question documents deleted successfully.`);
        } else {
            console.log('No question documents found or not deleted.');
        }

        res.status(200).json({
            data: {
                question: {
                    id: quiz_id
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
    quizDelete
  };