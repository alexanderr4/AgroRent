const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUsers = async (req, res)=>{
    console.log(req.body);
    let body = req.body;
    try{
        const credencial = await prisma.credenciales.create({
            data:{
                nombre_usuario:body.nombre_user,
                contrasena_usuario: body.contrasena_usuario,  
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
    const a = await prisma.credenciales.findMany();
    res.json({a});
}

module.exports={getUsers, createUsers};