const { MongoClient } = require('mongodb');
const { hashPassword, isValidEmail, generateToken } = require('../../utils/utils');
require('dotenv').config({ path: __dirname + `/../../.env` });

const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!(name && email && password)) {
    return res.status(400).json({ error: 'You should not leave empty!' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please fill the correct email address!' });
  }

  const client = new MongoClient(url, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    // Check if the user already exists
    const userExists = await usersCollection.findOne({ email });
    if (userExists) {
      return res.status(403).json({ error: 'Email address already exists!' });
    }

    // Encrypt the user password
    const securePassword = hashPassword(password);

    // Create a new user
    const newUser = {
      name,
      email,
      password: securePassword,
      provider: 'native',
      tags:[]
    };

    // Insert the new user
    const insertResult = await usersCollection.insertOne(newUser);
    console.log('New user inserted:', insertResult.insertedId);

    // Create the JWT Token Payload
    const payload = {
      id: insertResult.insertedId,
      provider: 'native',
      name: newUser.name,
      email: newUser.email
    };

    // Sign the Access Token using JWT
    const accessToken = generateToken({ id: payload.id });

    // Return the successful signup response
    return res.status(200).json({
      data: {
        access_token: accessToken,
        user: payload,
      },
    });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while signing up.' });
  } finally {
      await client.close();
  }
};

// 導出 signUpUser 函數供其他地方使用
module.exports = {
  signUp
};
