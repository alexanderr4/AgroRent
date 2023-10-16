const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient();

const createMachinery = async (req, res) =>{
    let body = req.body;
    try{
        const user = await prisma.usuarios.findUnique({
            where:{
                documento_usuario: body.documento_usuario,
            }
        });
        console.log(user)
        const create = await prisma.maquinarias.create({
            data:{ 
                id_usuario : user.id_usuario,
                nombre_maquina : body.nombre_maquina, 
                descripcion_maquina: body.descripcion_maquina,
                placa_maquina: body.placa_maquina,
                modelo_maquina : body.modelo_maquina,
                estado_maquina : body.estado_maquina,
                precio_hora : body.precio_hora
            }
        });
        res.status(200).json({mesanje:"maquinaria creada"})
    }catch(error){
        console.log(error.code)
        if(error instanceof TypeError){
            res.status(404).json({mesanje:"usuario no encontrado"})
        }else{
            res.status(500).json({mesanje:"error al agregar la maquinaria"})
        }
    }
}

const getMachinery = async (req, res)=>{
    try {
        const get = await prisma.maquinarias.findMany();
        res.status(200).json(get);
    } catch (error) {
        res.status(500).json({mesanje : "error al mostar las maquinaris"}); 
    }
}

module.exports={createMachinery, getMachinery};
