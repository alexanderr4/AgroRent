const express = require('express');
const router = express.Router();
const reserve= require('../controllers/reserve.js');

router.post('/createReserve', reserve.createReserve)
        .get("/getReserve", reserve.filterIdReserve)
        .get('/filterIdReserveUser', reserve.filterIdReserveUser)
        .get('/filterRequested', reserve.filterRequestedMachinery)
        .put('/changeStatus', reserve.changeStatusMachinery)
module.exports = router; 
