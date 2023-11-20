const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient();

const rent = async (req, res) =>{
    let body = req.body;
    try{
        const rent = await prisma.alquiler_maquinas.create({data:body});
        res.status(200).json({ mensanje:"alquiler creado" });
    }catch(error){
        console.error(error);
        res.status(500).json({ mensanje:"error al crear el alquiler" });
    }
}

const getRentdUser = async (req, res) =>{
    let body = req.query.id
    try{
        const rent = await prisma.reservas.findMany({
            where:{
                id_usuario : parseInt(body)
            }
        });
        const mapReserve = rent.map(reservas => reservas.id_reserva);
        const getAlquiler = await prisma.alquiler_maquinas.findMany({
            where:{
                id_reserva:{ 
                    in:mapReserve
                }
            }
        });
        res.status(200).json(getAlquiler);
    }catch(error){
        console.error(error);
        if(error.code == undefined){
            res.status(404).json({mensaje:"parametro de entrada no valido"});
        }else{
            res.status(500).json({mensaje:"error al obtener las reservas"});
        }
    }
}

const getRentRequestedUser = async (req, res) =>{
    let body = req.query.id
    try{
        const machinery = await prisma.maquinarias.findMany({
            where:{
                id_usuario : parseInt(body)
            }
        });
        const mapMachinery = machinery.map(maquinarias => maquinarias.id_maquinaria);
        const getAlquiler = await prisma.reservas.findMany({
            where:{
                id_maquinaria:{ 
                    in:mapMachinery
                }
            }
        });
        const mapReserve = getAlquiler.map(reservas => reservas.id_reserva);
        const rent = await prisma.alquiler_maquinas.findMany({
            where :{
                id_reserva:{
                    in:mapReserve
                }
            }
        })
        res.status(200).json(rent);
    }catch(error){
        console.error(error);
        if(error.code == undefined){
            res.status(404).json({mensaje:"parametro de entrada no valido"});
        }else{
            res.status(500).json({mensaje:"error al obtener las reservas"});
        }
    }
}

module.exports = {rent, getRentRequestedUser, getRentdUser}