const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient();
const moment = require('moment');
const {getPaths} = require('./machinery.js');
const { DateTime } = require('luxon');
const e = require('express');


const createReserve = async (req, res) =>{
    body = req.body
    try{
        if(validateDateActual(body.fecha_hra_inicio, body.facha_hora_fin)){
            console.log(validateDateActual(body.fecha_hra_inicio, body.facha_hora_fin))
            body.fecha_hra_inicio = moment.utc(body.fecha_hra_inicio, "YYYY-MM-DDTHH:mm").toISOString();
            body.facha_hora_fin = moment.utc(body.facha_hora_fin, "YYYY-MM-DDTHH:mm").toISOString();
            console.log(body)
            bodyReserves = {
                fecha_hra_inicio : body.fecha_hra_inicio,
                facha_hora_fin : body.facha_hora_fin
            }
        
            const getReserves = await prisma.reservas.findMany({
                where : {id_maquinaria : body.id_maquinaria}
            });
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
        }else{
            res.status(404).json( {mensaje: "Ingrese una fecha y hora superior a la actual"} )
        }
    }catch(error){
        console.error(error);
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

// const date = async(req, res)=>{
//     body = req.body;
//     const get = await prisma.reservas.findMany();
//     const mapReserve = get.map((reservas) => {
//         return {
//             fecha_hra_inicio : reservas.fecha_hra_inicio,
//             facha_hora_fin : reservas.facha_hora_fin
//         }
//     });
//     validateDate(mapReserve, body)
//     console.log(mapReserve)
//     res.status(200).json(mapReserve)
// }


const filterIdReserve = async (req, res) => {
    let body = req.query.id
    try{
        let reserves = await prisma.reservas.findMany({
            where:{
                id_maquinaria:parseInt(body)
            }
        })
        
        res.status(200).json(mapReservesT(reserves))
    } catch (error) {
        console.error(error);
        if(error.code == undefined){
            res.status(404).json({mensaje:"error al traer la reservas parametro de entrada no valido"});
        }else{
            res.status(500).json({mensaje:"error al obtener las reservas"});
        }
    }
}

const filterIdReserveUser = async (req, res) => {
    let body = req.query.id
    try{
        let reserves = await prisma.reservas.findMany({
            where:{
                id_usuario:parseInt(body)
            },include: {
                maquinarias: {
                    select: {
                        nombre_maquina: true // El nombre de usuario de la tabla "credenciales"
                    }
                }
            }
        });
        const idsReserves = reserves.map(reservas => reservas.id_maquinaria);
        const images = await prisma.imagenes.findMany({
            where:{
                id_maquinaria:{ 
                    in:idsReserves
                }
            }
        });
        console.log(idsReserves);
        res.status(200).json(mapIdReserveUser(reserves, images))
    }catch (error) {
        console.error(error);
        if(error.code == undefined){
            res.status(404).json({mensaje:"error al traer la reservas parametro de entrada no valido"});
        }else{
            res.status(500).json({mensaje:"error al obtener las reservas"});
        }
    }
}

const filterRequestedMachinery = async (req, res) =>{
    let body = req.query.id;
    body = parseInt(body);
    try {
        const getMachineryRequeste = await prisma.maquinarias.findMany({
            where:{
                id_usuario:body
            }, select: {
                id_maquinaria: true,
                nombre_maquina : true
            }
        });
        const idsMaquinarias = getMachineryRequeste.map(maquinarias => maquinarias.id_maquinaria);
        const getReservesUser = await prisma.reservas.findMany({
            where:{
                id_maquinaria:{ 
                    in:idsMaquinarias
                }, 
                validacion_reserva:"P"
            },include:{
                maquinarias:{
                    select:{
                        nombre_maquina: true
                    }
                }
            }
        });
        const images = await prisma.imagenes.findMany({
            where:{
                id_maquinaria:{ 
                    in:idsMaquinarias
                }
            }
        });
        res.status(200).json(mapIdReserveUser(getReservesUser, images));
    }catch (error) {
        console.error(error);
        if(error.code == undefined){
            res.status(404).json({mensaje:"error al traer la reservas parametro de entrada no valido"});
        }else{
            res.status(500).json({mensaje:"error al obtener las reservas"});
        }
    }
}

const changeStatusMachinery = async (req, res) => {
    let body = req.query
    try {
        const changeStatus = await prisma.reservas.update({
            where:{id_reserva: parseInt(body.id)},
            data:{validacion_reserva: body.estado.toUpperCase()}
        })
        if(body.estado.toUpperCase() == 'A'){
            res.status(200).json({mensaje:"la reserva ha sido aceptada exitosamente"});
        }else{
            res.status(200).json({mensaje:"la reserva ha sido rechazada exitosamente"});
        }
    } catch (error) {
        console.error(error)
        if(error.code == 'P2025'){
            res.status(404).json({mensaje:"no se ha encontrado la reserva"});
        }else if(error.code == undefined){
            res.status(404).json({mensaje:"parametro de entrada invalido"});
        }else{
            res.status(500).json({mensaje:"no se ha podio cambiar el estado de la reserva"});
        }

    }
}

const getAllReserves = async (req, res) =>{
    try {
        const getReserves = await prisma.reservas.findMany({
            include:{
                maquinarias:{
                    select:{nombre_maquina:true,
                        id_maquinaria : true
                    }
                }
            }
    
        });
        const mapReserves = getReserves.map(reservas => reservas.id_maquinaria);
        const getimages = await prisma.imagenes.findMany({
            where :{
                id_maquinaria:{
                    in:mapReserves
                }
            }
        });
        res.status(200).json(mapIdReserveUser(getReserves, getimages))
    } catch (error) {
        console.error(error)
        res.status(500).json({mensaje :" Error al obtener las reservas"})
    }
}

function validateDateActual(startDate, endDate){
    // Obtén la fecha y hora actual en la zona horaria de Colombia
    var currentDateTime = DateTime.now().setZone('America/Bogota')
    const year = currentDateTime.year;
    var month = currentDateTime.month;
    month = `${month}`.length < 2? 0+`${month}`: `${month}`;
    var day = currentDateTime.day;
    day = `${day}`.length < 2? 0+`${day}`: `${day}`;

    // Obten la hora y minutos
    var hour = currentDateTime.hour;
    hour = `${hour}`.length < 2? 0+`${hour}`: `${hour}`;
    var minute = currentDateTime.minute;
    minute = `${minute}`.length < 2? 0+`${minute}`: `${minute}`;
    actualDate = `${year}-${month}-${day}T${hour}:${minute}`
    // Imprime la fecha y la hora por separado
    return new Date(startDate) > new Date(actualDate) && new Date(endDate) > new Date(actualDate)
}

function mapIdReserveUser(reserves, imagenes){
    const mapReserves = reserves.map((reservas) => {
        return {
        id_reserva: reservas.id_reserva,
        id_usuario: reservas.id_usuario,
        id_maquinaria: reservas.id_maquinaria,
        fecha_hra_inicio : moment.utc(reservas.fecha_hra_inicio).format("YYYY-MM-DDTHH:mm"),
        facha_hora_fin : moment.utc(reservas.facha_hora_fin).format("YYYY-MM-DDTHH:mm"),
        validacion_reserva : reservas.validacion_reserva,
        nombre_maquina : reservas.maquinarias.nombre_maquina,
        path : getPaths(imagenes, reservas.id_maquinaria)
    
        }
    });
    return mapReserves;
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

module.exports={createReserve, filterIdReserve, filterIdReserveUser, filterRequestedMachinery, changeStatusMachinery, getAllReserves};