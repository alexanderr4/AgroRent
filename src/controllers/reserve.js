const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient();
const moment = require('moment');

const createReserve = async (req, res) =>{
    body = req.body
    body.fecha_hra_inicio = moment.utc(body.facha_hora_fin, "YYYY-MM-DDTHH:mm").toISOString();
    body.facha_hora_fin = moment.utc(body.facha_hora_fin, "YYYY-MM-DDTHH:mm").toISOString();
    console.log(body)
    bodyReserves = {
        fecha_hra_inicio : body.fecha_hra_inicio,
        facha_hora_fin : body.facha_hora_fin
    }
    try{
        const getReserves = await prisma.reservas.findMany();
        const mapReserves = getReserves.map((reservas) => {
            return {
                fecha_hra_inicio : reservas.fecha_hra_inicio,
                facha_hora_fin : reservas.facha_hora_fin
            }
        });
        if(validateDate(mapReserves, bodyReserves)){
            const create = await prisma.reservas.create({
                data:body
            });
            res.status(200).json({mensaje:"reserva creada"})
        }else{
            res.status(404).json({mensaje:"fecha no disponible"})
        }
    }catch(error){
        console.error(error.code);
        if(error.code == 'P2003'){
            if (error.meta.field_name =='id_usuario' ) {
                res.status(404).json({ mensaje: 'El usuario no se encontro' });
            }else if(error.meta.field_name == 'id_maquinaria'){
                res.status(404).json({ mensaje: 'La maquina no se encontro' });
            }
        }else if(error.code === undefined){
            res.status(404).json({ mensaje: 'Error al validar la fecha' });
        }else{
            res.status(500).json({ mensaje: 'Error al crear la reserva' });
        }
    }
}

const date = async(req, res)=>{
    body = req.body;
    const get = await prisma.reservas.findMany();
    const mapReserve = get.map((reservas) => {
        return {
            fecha_hra_inicio : reservas.fecha_hra_inicio,
            facha_hora_fin : reservas.facha_hora_fin
        }
    });
    validateDate(mapReserve, body)
    console.log(mapReserve)
    res.status(200).json(mapReserve)
}


const filterIdReserve = async (req, res) => {
    let body = req.query.id
    try{
        let reserves = await prisma.reservas.findMany({
            where:{
                id_maquinaria:parseInt(body)
            }
        })
        
        res.status(200).json(mapReservesT(reserves))
    }catch(error){
        console.log(error)
    }
}


function mapReservesT(reserves){
    const mapReserves = reserves.map((reservas) => {
        return {
        id_reserva: reservas.id_reserva,
        id_usuario: reservas.id_usuario,
        id_maquinaria: reservas.id_maquinaria,
        fecha_hra_inicio : moment.utc(reservas.fecha_hra_inicio).format("YYYY-MM-DDTHH:mm"),
        facha_hora_fin : moment.utc(reservas.facha_hora_fin).format("YYYY-MM-DDTHH:mm"),
        validacion_reserva : reservas.validacion_reserva
        }
    });
    return mapReserves;
}

function validateDate(mapReserve, body){
    var rango1ContenidoEnRango2 = true;
    var rango2ContenidoEnRango1 = true;
    var limiteInicioRango2EnRango1 = true;
    var limiteFinRango2EnRango1 = true;
    var fechaEnRango1 = true;
    var fechaEnRango2 = true;
    var result = true;

    var count = 0;
       // Definir los rangos
    var rango1 = null;
    const rango2 = {
        inicio: new Date(body.fecha_hra_inicio),
        fin: new Date(body.facha_hora_fin)
    };
    while(result && count < mapReserve.length){
        rango1 = {  
            inicio: new Date(mapReserve[count].fecha_hra_inicio),
            fin: new Date(mapReserve[count].facha_hora_fin)
        };
        rango1ContenidoEnRango2 = rango1.inicio >= rango2.inicio && rango1.fin <= rango2.fin;
        rango2ContenidoEnRango1 = rango2.inicio >= rango1.inicio && rango2.fin <= rango1.fin;
        limiteInicioRango2EnRango1 = rango2.inicio >= rango1.inicio && rango2.inicio <= rango1.fin;
        limiteFinRango2EnRango1 = rango2.fin >= rango1.inicio && rango2.fin <= rango1.fin;

            // Verificar si alguna fecha está contenida en el otro rango
        fechaEnRango1 = rango2.inicio >= rango1.inicio && rango2.inicio <= rango1.fin;
        fechaEnRango2 = rango1.inicio >= rango2.inicio && rango1.inicio <= rango2.fin;
            
            
            // Imprimir los resultados
        count += 1;
        result = !rango1ContenidoEnRango2 && !rango2ContenidoEnRango1 && !limiteInicioRango2EnRango1 && !limiteFinRango2EnRango1 && !fechaEnRango1 && !fechaEnRango2;
    }
    
    //result = count == mapReserve.length? true : false
    console.log(result);
    return result;
}

function convertirFechaFormato1aFormato2(fechaStr) {
    return fechaStr.replace(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}):\d{2}\.\d{3}Z$/, '$1T$2');
}

// Convertir de "2023-11-15T15:19" a "2024-05-02T16:05:00.000Z"
function convertirFechaFormato2aFormato1(fechaStr) {
    return fechaStr.replace(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/, '$1:00.000Z');
}

module.exports={createReserve, filterIdReserve};