const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: __dirname + `/../../.env` });


const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const questionDelete = async (req, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        const user_id = new ObjectId(req.signInId);
        const question_id = new ObjectId(req.params.id);
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);

        const questionsCollection = db.collection('questions');
        const deleteQuestion = await questionsCollection.deleteOne( {_id: question_id } );

        if (deleteQuestion.deletedCount === 1) {
            console.log('Document deleted successfully.');
        } else {
            console.log('Document not found or not deleted.');
        }

        res.status(200).json({
            data: {
                question: {
                    id: question_id
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
    questionDelete
  };