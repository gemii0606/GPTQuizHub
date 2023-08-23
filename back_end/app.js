const express = require('express');
const routes = require('./server/routes');
const app = express();
const http = require('http');
// const socketIo = require('socket.io');
var cors = require('cors'); // 引入 cors 模块


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

    socket.on('createroom', (roomName) => {
        socket.join(`room:${roomName}`);
        console.log(`User ${socket.id} created and joined room ${roomName}`);
        roomConnections[roomName] = {
            creater_id: roomName
        }
        console.log(roomConnections)
    });

    socket.on('joinroom', (roomName, user_id) => {
        console.log(`User ${socket.id} joined room ${roomName}`);
        if (roomConnections[roomName]) {
            socket.join(roomName);
            roomConnections[roomName].opponent_id = user_id; // 添加连接到房间的关系
        } else {
            socket.emit('joinroom_error', 'Room not found');
        }
        console.log(roomConnections)
    });

    socket.on('isready', (roomName, user_id) => {
        console.log(`User ${socket.id} is ready in room ${roomName}`);
        if (roomConnections[roomName].creater_id === user_id) {
            roomConnections[roomName].creater_status = 'ok'
        }
        if (roomConnections[roomName].opponent_id === user_id) {
            roomConnections[roomName].opponent_status = 'ok'
        }
        if (roomConnections[roomName].creater_status === 'ok' && roomConnections[roomName].opponent_status === 'ok') {
            const data = {
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
        io.to(roomName).emit('start', {data});
        }
        
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
        
        // 从房间关系中删除断开连接的记录
        // for (const room in roomConnections) {
        //     const index = roomConnections[room].indexOf(socket.id);
        //     if (index !== -1) {
        //         roomConnections[room].splice(index, 1);
        //         if (roomConnections[room].length === 0) {
        //             delete roomConnections[room]; // 如果房间为空，删除房间关系
        //         }
        //         break;
        //     }
        // }
    });
});

server.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});