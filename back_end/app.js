const express = require('express');
const routes = require('./server/routes');
const app = express();
var cors = require('cors');

app.use(cors())
app.use('/api/1.0', routes);

app.listen(3000, () => {
    console.log(`Ready. Listening in ${3000}`);
}); 

