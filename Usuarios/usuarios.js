const mysql = require('mysql');

function insert(connection, callback){
    let insertQuery = "INSERT INTO usuarios (id_usuario, credenciales_id_crdencial, nombre_usuario, apellido_usuario, tipo_documento, documento_usuario, numero_celu_usuario, correo_usuario, tipo_usuario) VALUES (10, 1, 'jose', 'roemro', 'cc','1003912861', 314, 'jose.romero07', 'a')  ";
    connection.query(insertQuery, function(err, result) {
        if(err) throw err;
        callback(result)
    });
}

module.exports = {insert};