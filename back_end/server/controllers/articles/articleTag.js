const { MongoClient, ObjectId } = require('mongodb');
const { encodejsonBase64, decodejsonBase64 } = require('../../utils/utils');

const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const findTags = async (req, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        const signInId = new ObjectId(req.signInId);
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ _id: signInId });
        const transformedTags = user.tags.map((tag, index) => ({
                id: index + 1,
                name: `${tag}`,
        }));
        res.status(200).json({ data: { tags: transformedTags}})
    } catch(error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error"})
    }
}

module.exports = {
    findTags
}
