const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient();

const createReserve = async (req, res) =>{
    body = req.body
    try{
        const create = await prisma.reservas.create({
            data:body
        });
        res.status(200).json({mensaje:"reserva creada"})
    }catch(error){
        console.error(error);
        console.log(error.meta.field_name)
        if(error.code == 'P2003'){
            if (error.meta.field_name =='id_usuario' ) {
                res.status(404).json({ mensaje: 'El usuario no se encontro' });
            }else if(error.meta.field_name == 'id_maquinaria'){
                res.status(404).json({ mensaje: 'La maquina no se encontro' });
            }
        }else{
            res.status(500).json({ mensaje: 'Error al crear la reserva' });
        }
    }
}

module.exports={createReserve};