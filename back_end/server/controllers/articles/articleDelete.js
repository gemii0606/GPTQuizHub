const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: __dirname + `/../../.env` });


const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const articleDelete = async (req, res) => {
    const user_id = new ObjectId(req.signInId);
    const quiz_id = new ObjectId(req.params.id);

    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);

        const quizzesCollection = db.collection('quizzes');
        const deleteContent = await quizzesCollection.updateOne({ _id: quiz_id }, { $set: { is_deleted: true, content: null } });
        console.log(deleteContent)

        res.status(200).json({
            data: {
                article: {
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
    articleDelete
  };