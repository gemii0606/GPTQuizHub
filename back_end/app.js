const express = require('express');
const http = require('http'); // 引入 http 模块
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app); // 使用 http 模块创建服务器
const io = socketIo(server); // 将 Socket.IO 集成到服务器

// 其他 Express 中间件和路由设置

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    
    // 在此处理其他 Socket.IO 事件
});

server.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});
