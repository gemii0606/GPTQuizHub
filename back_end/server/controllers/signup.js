const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {isValidEmail} = require('../utils');
require('dotenv').config();

const url = process.env.MONGOURL;
const dbName = 'users'; // 您的資料庫名稱

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!(name && email && password)) {
    return res.status(400).json({ error: 'You should not leave empty!' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please fill the correct email address!' });
  }

  try {
    const client = new MongoClient(url, { useUnifiedTopology: true });
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
    const securePassword = crypto
      .createHash('sha256')
      .update(password + email)
      .digest('base64');

    // Create a new user
    const newUser = {
      name,
      email,
      password: securePassword
    };

    // Insert the new user
    const insertResult = await usersCollection.insertOne(newUser);
    console.log('New user inserted:', insertResult.insertedId);

    // Create the JWT Token Payload
    const jwtSecret = process.env.SECRET; // 這裡應該是一個安全的秘密，用於 JWT 簽名
    const payload = {
      id: insertResult.insertedId,
      name: newUser.name,
      email: newUser.email
    };

    // Sign the Access Token using JWT
    const accessToken = jwt.sign(payload, jwtSecret);

    // Return the successful signup response
    res.status(200).json({
      data: {
        access_token: accessToken,
        user: payload,
      },
    });

    client.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while signing up.' });
  }
};

// 導出 signUpUser 函數供其他地方使用
module.exports = signUp;
