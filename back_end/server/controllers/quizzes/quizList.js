const { MongoClient, ObjectId } = require('mongodb');
const { encodejsonBase64, decodejsonBase64 } = require('../../utils/utils');

const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';
const limit = 10;

const quizList = async (req, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {       
        const signInId = new ObjectId(req.signInId);
        console.log(signInId)
    
        await client.connect();
        const db = client.db(dbName);
        const quizzesCollection = db.collection('quizzes');
        const cursor = req.query.cursor ? atob(req.query.cursor) : req.query.cursor;
        const tag = req.query.tag;
        
        console.log(cursor);
        console.log(tag)

        const quizzes = await quizzesCollection.find({
            user_id: signInId,
            created_at: cursor ? { $lt: cursor } : { $exists: true },
            tag: tag ? tag : { $exists: true },
        }).project({
            _id: 0,
            id: "$_id",     
            created_at: 1,
            tag: 1,
            title:1
            // user_id: -1
        }).sort({ created_at: -1 }).limit(limit).toArray();

        // console.log(quizzes[li])
        const next_cursor = (quizzes.length === limit) ? btoa(quizzes[limit - 1].created_at) : null
        res.status(200).json({
            data: {
                quizzes,
                next_cursor
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
    quizList
}