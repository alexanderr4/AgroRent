const express = require('express');
const router = express.Router();
const users= require('../controllers/reserve.js');

router.post('/createReserve', users.createReserve)
        .get('/gettt', users.date)
        .get("/getReserve", users.filterIdReserve)


module.exports = router; 
