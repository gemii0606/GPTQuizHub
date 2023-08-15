const { MongoClient } = require('mongodb');
const { hashPassword, isValidEmail, generateToken } = require('../../utils/utils');

const url = 'mongodb://localhost:27017';
const dbName = 'Canchu';

const signIn = async (req, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        await client.connect();
        const {name, email, password} = req.body;
        console.log(req.body)
        if(!name || !email || !password)
            res.status(400).json({ error: 'The input can\'t be null' });
        else if (!isValidEmail(email))
            res.status(400).json({ error: 'Email invalid' });  
        else if (!(await isSignUp(email))) 
            res.status(403).json({ error: 'Please sign up first' });
        else {
            const hash = hashPassword(password);
            const user = await isSignUp(email);
            if(hash !== user.password)
                res.status(403).json({ error: 'Wrong Password' });
            else {
                const payload = {
                    id:user._id
                }
                const token = generateToken(payload)
                res.status(200).json({ data:{
                    access_token: token,
                    user:{
                        id: _id,
                        email: user.email
                    }
                }});
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error." })
    } finally {
        await client.close();
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

