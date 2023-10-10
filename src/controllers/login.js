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
        console.log(credencial)
        if(credencial== null){
            credencial = await prisma.usuarios.findUnique({
                where:{
                    correo_usuario:body.nombre_user,
                }
            });
            credencial = await prisma.credenciales.findUnique({
                where:{
                    credenciales_id_crdencial: credencial.id_crdencial,
                }
            });
        }
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
        }
        // }else if(credencial){
        //     throw new Error("P2002")
        // }
        }catch(error){
        console.error(error);
        console.log(error.code);
        console.log("hoal");

        // Si el error se debe a que se violó una restricción única, responder con un mensaje específico
        if (error.code === "P2025") {
            res.status(404).json({ mensaje: "Contraseña o Usuario invalido" });
            if (error.meta.target.includes('nombre_usuario')) {
                res.status(404).json({ mensaje: 'ya hay alaguien con ese documento ' }); 
            }
        } else {
            res.status(500).json({ mensaje: "Error al iniciar sesion" });
        }
    }
}
module.exports={login};