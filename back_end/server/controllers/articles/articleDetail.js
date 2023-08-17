const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: __dirname + `/../../.env` });


const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const articleDetail = async (req, res) => {
    const user_id = new ObjectId(req.signInId);
    const article_id = new ObjectId(req.params.id);

    console.log(user_id)
    console.log(article_id)

    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);

        const articlesCollection = db.collection('articles');
        const findArticle = await articlesCollection.findOne({
            $and: [
              { user_id: user_id },
              { article_id: article_id }
            ]
          });

        console.log(findArticle)
        console.log("1")
        res.status(200).json({
            data: {
                article: {
                    id: findArticle._id,
				    title: findArticle.title,
				    tag: findArticle.tag,
				    created_at : findArticle.created_at,
			        content : findArticle.content,
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
    articleDetail
  };