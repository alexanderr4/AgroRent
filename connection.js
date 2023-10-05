const mysql= require('mysql');
require('dotenv').config();

var connection =mysql.createConnection({
    port: process.env.DBPORT,
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DANAME
});

connection.connect((err)=> {
    if(!err){
        console.log("Conectado")
    }else{
        console.log("Error de conexion",err);
    }
});

module.exports = connection;
