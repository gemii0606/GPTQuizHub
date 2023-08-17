const { MongoClient } = require('mongodb');
const { encodejsonBase64, decodejsonBase64 } = require('../../utils/utils');

const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';


const articlesList = async (req, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    const signInId = req.signInId;
    console.log(signInId)
    try {
        await client.connect();
        const db = client.db(dbName);
        const articlesCollection = db.collection('articles');
        const cursor = req.query.cursor ? parseInt(atob(req.query.cursor)) : req.query.cursor;

        console.log(cursor)

        const articles = await quizzesCollection.find({
            user_id: signInId,
            created_at: cursor ? { $lt: cursor } : { $exists: true }
        }).sort({ created_at: -1 }).limit(limit).toArray();

        // console.log(quizzes[li])
        const next_cursor = (articles.length === limit) ? btoa(articles[limit - 1].created_at) : null
        res.status(200).json({
            data: {
                articles,
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
    articlesList
}