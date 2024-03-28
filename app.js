const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.send('hello world');
});

console.log('listening on 3000...')
app.listen(3000);