const express = require("express");

const app = express();

app.use(express.json());

app.use('/api', require('./routes/routUsers.js'));
app.use('/api', require('./routes/routeLogin.js'))

app.listen(3000);
console.log('servididor puerto', 3000)