const express = require('express');
const connection = require('../connection')
const router = express.Router();

router.post('/signup', (req, res)=>{
    let credencial = req.body;
    console.log(req.body)
    query = "select nombre_usuario, contrasena_usuario from credenciales where nombre_usuario=?";
    connection.query(query,[credencial.nombre_usuario], (err, results)=>{
        console.log(results)
        console.log(results.length)
        if(!err){
            if(results.length<=0){
                query = "insert into credenciales (nombre_usuario, contrasena_usuario) value(?,?)";
                connection.query(query, [credencial.nombre_usuario, credencial.contrasena_usuario], (err, results)=>{
                    if (!err){
                        return res.status(200).json({message:"credencial registrada"});
                    }else{
                        return res.status(500).json(err);
                    }
                })
            }else{
                return res.status(400).json({message:"El nombre de usario ya existe"});
            }
        }else{
            return res.status(500).json(err);
        }

    });

});

//select credenciales_id_crdencial, nombre_usuario, apellido_usuario, tipo_documento, documento_usuario, numero_celu_usuario, correo_usuario, tipo_usuario"

module.exports = router;