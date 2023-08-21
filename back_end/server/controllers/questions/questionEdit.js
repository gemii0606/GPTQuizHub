const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: __dirname + `/../../.env` });


const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const questionEdit = async (req, res) => {
    console.log('questionedit')
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        const user_id = new ObjectId(req.signInId);
        const question_id = new ObjectId(req.params.id);
        const userEdit = req.body;
        console.log(userEdit)
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);

        const questionsCollection = db.collection('questions');
        const updateQuestion = await questionsCollection.updateOne(
            {_id: question_id }, 
            { $set: {...userEdit} }
        );

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
    questionEdit
  };