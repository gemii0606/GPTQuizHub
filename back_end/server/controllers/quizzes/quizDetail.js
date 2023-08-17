const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: __dirname + `/../../.env` });


const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const quizDetail = async (req, res) => {
    const user_id = new ObjectId(req.signInId);
    const quiz_id = new ObjectId(req.params.id);

    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);

        const aggregation = [
            {
                $match: {
                  _id: quiz_id
                }
              },
            {
              $lookup: {
                from: 'questions', // 另一個集合名稱
                localField: '_id', // 本集合的關聯欄位
                foreignField: 'quiz_id', // 另一個集合的關聯欄位
                as: 'combinedData' // 聯結後的欄位名稱
              }
            }
          ];

        const quizzesCollection = db.collection('quizzes');
        const combinedResult = await quizzesCollection.aggregate(aggregation).toArray();
        console.log(combinedResult)
        console.log(combinedResult.combinedData[0])

        // const questions = combinedResult.map(obj => {

        // })

        res.status(200).json({
            data: {
                quiz: {
                    id: 1,
				    title: 1,
				    tag: 1,
				    created_at : 1,
			        question : []
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
    quizDetail
  };