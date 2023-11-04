const express = require('express');
const router = express.Router();
const users= require('../controllers/reserve.js');

router.post('/createReserve', users.createReserve)


module.exports = router; 
