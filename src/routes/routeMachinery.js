const express = require('express');
const router = express.Router();
const users= require('../controllers/machinery.js');

router.post('/create', users.createMachinery)
        .get('/hideMachinery', users.getMachinery)
module.exports = router; 