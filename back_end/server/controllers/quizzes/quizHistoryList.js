const { MongoClient, ObjectId } = require('mongodb');
const { encodejsonBase64, decodejsonBase64 } = require('../../utils/utils');

const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';
const limit = 10;

const quizHistoryList = async (req, res) => {
    console.log('quizhistorylist')
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        await client.connect();
        const signInId = req.signInId;
        const db = client.db(dbName);
        const quizzesHistoryCollection = db.collection('quizzesHistory');
        const cursor = req.query.cursor ? atob(req.query.cursor) : req.query.cursor;
        const tag = req.query.tag;

        const quizzes = await quizzesHistoryCollection.aggregate([
            {
              $lookup: {
                from: "quizzes",
                localField: "quiz_id",
                foreignField: "_id",
                as: "quiz"
              }
            },
            {
              $unwind: "$quiz"
            },
            {
              $match: {
                "quiz.user_id": new ObjectId(signInId),
                created_at: cursor ? { $lt: cursor } : { $exists: true },
                tag: tag ? tag : { $exists: true },
              }
            },
            {
              $project: {
                _id: 0,
                id: "$_id",
                quiz_id: 1,
                accuracy: 1,
                quizHistory_created_at: 1,
                wrongAnswer: 1,
                title:"$quiz.title"
              }
            }
          ]).sort({ created_at: -1 }).limit(limit).toArray()
        res.status(200).json({data:{quizzes}})
          
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error." })
    } finally {
        await client.close();
    }
}

module.exports = {
    quizHistoryList
}