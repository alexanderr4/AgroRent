const express = require('express');
const app = express();
const mysql= require("mysql")
require("dotenv").config();
const {insert} = require('./Usuarios/usuarios')

app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user : process.env.DBUSER,
    password :process.env.DBPASSWOED,
    database :process.env.DBDATABSE
});

connection.connect((err) => {
    if (err) throw err;
    console.log("conecta a la base de datos")

})

app.get("/", (req, res) => {
    res.send("hello");
});

app.get("/insertUsers", (req, res) => {
   insert(connection, result=>{
    res.json(result);
   })
});

app.listen(3000, () => {
    console.log("servidor corriendo en el puerto 3000");
});