const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {encrypt, compare} = require('../hendleB/handleBcrypt.js');

const createUsers = async (req, res)=>{
    console.log(req.body);
    let body = req.body;
    const passwordHash = await encrypt(body.contrasena_usuario);
    try{
        const credencial = await prisma.credenciales.create({
            data:{
                nombre_usuario:body.nombre_user,
                contrasena_usuario: passwordHash,  
            },    
        });
        const user =await prisma.usuarios.create({
            data:{
                credenciales_id_crdencial: credencial.id_crdencial,
                nombre_usuario: body.nombre_usuario,
                apellido_usuario: body.apellido_usuario,
                tipo_documento: body.tipo_documento,
                documento_usuario: body.documento_usuario,
                numero_celu_usuario: body.numero_celu_usuario,
                correo_usuario: body.correo_usuario,
                tipo_usuario: body.tipo_usuario,
            },
        });
        console.log("credencial   ", credencial)
        res.json({ msg: "creado", credencial});
           
    }catch(error){
        console.error(error);
        // Si el error se debe a que se violó una restricción única, responder con un mensaje específico
        if (error.code === "P2002") {
            res.status(400).json({ mensaje: "Ya existe un estudiante con el mismo código o número de documento" });
        } else {
            res.status(500).json({ mensaje: "Error al crear el estudiante" });
        }
    }
}

const getUsers = async (req, res)=>{
    const a = await prisma.usuarios.findMany({
        where:{
            estado_usuario: 'A',
        },
    });
    res.json({a});
}

const pacthUser = async (req, res)=>{
    let body = req.body;
    try{
        const upadateUser = await prisma.usuarios.updateMany({
            where:{
                documento_usuario: body.documento,
            },
            data:{
                nombre_usuario: body.nombre_usuario,
                apellido_usuario: body.apellido_usuario,
                tipo_documento: body.tipo_documento,
                documento_usuario: body.documento_usuario,
                numero_celu_usuario: body.numero_celu_usuario,
                correo_usuario: body.correo_usuario,
            },
        });
        res.json({ msg: "estudiante actualizado", upadateUser })
    }catch(error){
        console.error(error);
        if (error.code === "P2025") {
            res.status(404).json({ mensaje: `No se encontró un estudiante con el código ${req.params.codigo}` });
        } else {
            res.status(500).json({ mensaje: "Error al actualizar estudiante" });
        }
    }   
}

const updateStatus = async (req, res)=>{
    let body = req.body;
    try {
        const status = await prisma.usuarios.updateMany({
            where:{documento_usuario: body.documento},
            data:{estado_usuario:'I'}
        });
        res.json({ msg: "usuario eliminado", status })
    } catch (error) {
        console.error(error);
        if (error.code === "P2025") {
            res.status(404).json({ mensaje: `No se encontró un estudiante con el código ${req.params.codigo}` });
        } else {
            res.status(500).json({ mensaje: "Error al actualizar estudiante" });
        }
    }
}

module.exports={getUsers, createUsers, pacthUser, updateStatus};