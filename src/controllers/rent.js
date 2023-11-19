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

const getRent = async (req, res) =>{
    let body = req.body
    try{
        const rent = await prisma.alquiler_maquinas.findMany();
        res.status(200).json(rent);
    }catch(error){
        console.error(error);
        res.status(500).json({ mensanje:"error al obtener los alquileres" })
    }
}

module.exports = {rent, getRent}