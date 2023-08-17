const { MongoClient } = require('mongodb');
const { hashPassword, isValidEmail, generateToken } = require('../../utils/utils');
require('dotenv').config({ path: __dirname + `/../../.env` });

const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const signIn = async (req, res) => {
    try {
        const {provider, email, password} = req.body;
        if(!provider || !email || !password)
            return res.status(400).json({ error: 'The input can\'t be null' });
        else if (!isValidEmail(email))
            return res.status(400).json({ error: 'Email invalid' });  
        else if (!(await isSignUp(email))) 
            return res.status(403).json({ error: 'Please sign up first' });
        else {
            const hash = hashPassword(password);
            const user = await isSignUp(email);
            if(hash !== user.password)
                return res.status(403).json({ error: 'Wrong Password' });
            else {
                const payload = {
                    id:user._id
                }
                const token = generateToken(payload)
                return res.status(200).json({ data:{
                    access_token: token,
                    user:{
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        provider: user.provider
                    }
                }});
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error." })
    }
}

async function isSignUp(email) {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ email: email });
        return user; // If user is found, this will be true; otherwise, false
    } catch (err) {
        console.error('An error occurred:', err);
        return false;
    } finally {
        await client.close();
    }
}

module.exports = {
    signIn
};


