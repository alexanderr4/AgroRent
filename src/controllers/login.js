const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const {encrypt, compare} = require('../hendleB/handleBcrypt.js');

const login = async (req, res) =>{
    let body = req.body;
    try{
        let credencial = await prisma.credenciales.findUnique({
            where:{
                nombre_usuario: body.nombre_user,
            },
        });
        if(credencial === null){
            credencial = await prisma.usuarios.findUnique({
                where:{
                    correo_usuario:body.nombre_user,
                }
            });
            credencial = await prisma.credenciales.findUnique({
                where:{
                    id_crdencial: credencial.credenciales_id_crdencial,
                }
            });
        }
        const user =  await prisma.usuarios.findFirst({
            where:{
                credenciales_id_crdencial: credencial.id_crdencial,
            },
        });
       
        const checkPassword = await compare(body.contrasena_usuario, credencial.contrasena_usuario);
        if(checkPassword && user.estado_usuario === 'A'){
            res.status(200).json({tipo_usuario: user.tipo_usuario});
        
        }else if(credencial){
            throw new Error("P2002")
        }
    }catch(error){
        console.error(error);
        // Si el error se debe a que se violó una restricción única, responder con un mensaje específico
        if (error.message === "P2002") {
            res.status(404).json({ mensaje: "Contrasena o Usuario invalido" });
            if (error.meta.target.includes('nombre_usuario')) {
                res.status(404).json({ mensaje: 'ya hay alaguien con ese documento ' }); 
           }
        } else if(error instanceof TypeError){
            res.status(404).json({ mensaje: "Contrasena o Usuario invalido" });
        } else {
            res.status(500).json({ mensaje: "Error al iniciar sesion" });
        }
    }
}
module.exports={login};