const express = require('express');
const routes = require('./server/routes');
const app = express();
var cors = require('cors');
const http = require('http');
// const socketIo = require('socket.io');
var cors = require('cors'); // 引入 cors 模块

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: __dirname + `/.env` });

const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';


app.use(cors()); // 使用 cors 中间件
app.use('/api/1.0', routes);
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

const roomConnections = {}; // 用于存储房间和连接的关系

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('createroom', (user_id) => {
        socket.join(socket.id);
        console.log(`User ${user_id} created and joined room ${socket.id}`);
        roomConnections[socket.id] = {
            creater_id: user_id
        }
        socket.emit('createroom', socket.id);
        console.log(roomConnections)
    });

    socket.on('joinroom', (roomName, user_id) => {
        console.log(`User ${user_id} joined room ${roomName}`);
        if (roomConnections[roomName]) {
            socket.join(roomName);
            roomConnections[roomName].opponent_id = user_id; // 添加连接到房间的关系
        } else {
            socket.emit('joinroom_error', 'Room not found');
        }
        console.log(roomConnections)
    });

    socket.on('isready', (roomName, user_id) => {
        console.log(`User ${user_id} is ready in room ${roomName}`);
        console.log(roomName)
        console.log(user_id)
        if (roomConnections[roomName].creater_id === user_id) {
            roomConnections[roomName].creater_status = 'ok';
            console.log(roomConnections)
        }
        if (roomConnections[roomName].opponent_id === user_id) {
            roomConnections[roomName].opponent_status = 'ok';
            console.log(roomConnections)
        }
        if (roomConnections[roomName].creater_status === 'ok' && roomConnections[roomName].opponent_status === 'ok') {
            console.log('in double status')
            console.log(roomName)
            console.log(user_id)
            // const creater_id = new ObjectId(roomConnections[roomName].creater_id);
            // const opponent_id = new ObjectId(roomConnections[roomName].opponent_id);

            // const client = new MongoClient(url, { useUnifiedTopology: true });
            // await client.connect();
            // const db = client.db(dbName);
            // const quizzesCollection = db.collection('quizzes');
            // const allQuiz = await quizzesCollection.aggregate([
            //     { $match: {
            //         $or: [
            //             { user_id: creater_id },
            //             { user_id: opponent_id }
            //         ]
            //     }},
            //     { $sample: { size: 1 } } // 随机选择一个文档
            // ]).toArray();

            // const randomQuizId = allQuiz[0]._id;
            // console.log(randomQuizId)


            const data = {
                "article": "test",
                "quiz":{
                    "id": 123,
                    "title": "title",
                    "tag" : "world",
                    "created_at": "2023-08-07 03:32:19",
                    "questions":[
                          {
                            "id": 1,
                            "question": "What is the capital of France?",
                            "type": "multiple-choice",
                            "difficulty": "hard",
                                "options" : [
                                                    {
                                                      "id": 1,
                                                      "content": "London",
                                                    },
                                                    {
                                                      "id": 2,
                                                      "content": "Paris",
                                                    },
                                                    {
                                                      "id": 3,
                                                      "content": "Berlin",
                                                    },
                                                    {
                                                      "id": 4,
                                                        "content": "Madrid",
                                                    },
                                                  ],
                            "correct_answer": 2,
                            "explanation": "The capital of France is Paris.",
                          },
                          {
                            "id": 2,
                            "question": "What is the chemical symbol for gold?",
                            "type": "multiple-choice",
                            "difficulty": "normal",
                                "options" : [
                                                    {
                                                      "id": 1,
                                                      "content": "Au",
                                                    },
                                                    {
                                                      "id": 2,
                                                      "content": "Ag",
                                                    },
                                                    {
                                                      "id": 3,
                                                      "content": "Cu",
                                                    },
                                                    {
                                                      "id": 4,
                                                        "content": "Fe",
                                                    },
                                                  ],
                            "correct_answer": 1,
                            "explanation": "The chemical symbol for gold is Au.",
                          }
                    ]
            }
        }
        io.to(roomName).emit('isready', {data});
        }

        socket.on('disconnect', () => {
            console.log(`User ${socket.id} disconnected`);
            const keyToDelete = 'room:' + socket.id;
            delete roomConnections[keyToDelete];
        });
    });
})

server.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});
