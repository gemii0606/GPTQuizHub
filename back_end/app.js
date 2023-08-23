const express = require('express');
const routes = require('./server/routes');
const app = express();
var cors = require('cors');
const socketIO = require('socket.io');

app.use(cors())
app.use('/api/1.0', routes);

/*
app.listen(3000, () => {
    console.log(`Ready. Listening in ${3000}`);
}); 
*/

const server = app.listen(3000, () => {
    console.log(`Ready. Listening in ${3000}`);
});

const io = socketIO(server);

io.on('connection', ws => {

    //連結時執行此 console 提示
    console.log('Client connected')

    //當 WebSocket 的連線關閉時執行
    ws.on('close', () => {
        console.log('Close connected')
    })
})