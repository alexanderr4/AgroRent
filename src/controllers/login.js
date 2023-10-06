const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const {encrypt, compare} = require('../hendleB/handleBcrypt.js');

const login = async (req, res) =>{
    console.log(req.body)
    let body = req.body;
    try{
        const credencial = await prisma.credenciales.findUnique({
            where:{
                nombre_usuario: body.nombre_user,
            },
        });
        const user =  await prisma.usuarios.findFirst({
            where:{
                credenciales_id_crdencial: credencial.id_crdencial,
            },
        });
        /*if(user){
            res.status(404);
            res.send('Usuario no encontrado')
        }*/
        const checkPassword = await compare(body.contrasena_usuario, credencial.contrasena_usuario);
        if(checkPassword && user.estado_usuario ==='A'){
            res.send(user);
        }else if(credencial){
            throw new Error("P2002")
        }
    }catch(error){
        console.error(error);
        // Si el error se debe a que se violó una restricción única, responder con un mensaje específico
        if (error.message === "P2002") {
            res.status(400).json({ mensaje: "Contraseña o Usuario invalido" });
        } else {
            res.status(500).json({ mensaje: "Error al iniciar sesion" });
        }
    }
}
module.exports={login};