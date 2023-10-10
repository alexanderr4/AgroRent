const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {encrypt, compare} = require('../hendleB/handleBcrypt.js');


const createUsers = async (req, res)=>{
    let body = req.body;
    const passwordHash = await encrypt(body.contrasena_usuario);
    const status = await prisma.usuarios.updateMany({where:{documento_usuario:body.documento_usuario, estado_usuario : 'I'}, data:{estado_usuario : 'A'}});
    const  validateDocuemtEmail = await prisma.usuarios.findFirst({where:{OR:[{documento_usuario:body.documento_usuario}, {correo_usuario: body.correo_usuario}]}})
    try{
        if(status != 0){     //status != 0
            if(validateDocuemtEmail != null && validateDocuemtEmail.documento_usuario === body.documento_usuario ){
                res.status(404).json({ mensaje: 'ya hay alaguien con ese documento' });
            } else if (validateDocuemtEmail != null && mm.correo_usuario === body.correo_usuario && validateDocuemtEmail != null) {
                res.status(404).json({ mensaje: `ya hay alaguien con ese correo` });
            }else{
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
                // res.json({ msg: "creado", credencial});
                res.status(200).json({ mensaje: "usuario creado" });}      
        } else{
            console.log('si entra')
            status.estado_usuario = 'A'
            res.status(200).json({ mensaje: "usuario creado" });
            
            //console.log("credencial")
        } 
    }catch(error){
        console.error(error); 
        // Si el error se debe a que se violó una restricción única, responder con un mensaje específico
        if (error.code === "P2002") {
            //res.status(400).json({ mensaje: "Ya existe un usuario con ese numero de documento" });
            // if (error.meta.target.includes('documento_usuario')) {
            //     res.status(404).json({ mensaje: 'ya hay alaguien con ese documento ' });  
            if (error.meta.target.includes('nombre_usuario')) {
                res.status(404).json({ mensaje: 'ya hay alaguien nombre usuario ' });
            }
            // } else if (error.meta.target.includes('correo_usuario')) {
            //     res.status(404).json({ mensaje: `ya hay alaguien co ese correo` });
            // } else {
            //     res.status(404).json({ mensaje: `No se encontró un estudiante con el código` });
            // }
        } else {
            res.status(500).json({ mensaje: "Error al crear el usuario" });
        }
    }
}

const getUsers = async (req, res)=>{
    const a = await prisma.usuarios.findMany({
        where:{
            estado_usuario: 'A',
        },
    });
    res.json(a);
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

async function generatecorre(body){
    let userame= body.nombre_user.replace(/\s+/g, '.');

};

module.exports={getUsers, createUsers, pacthUser, updateStatus};