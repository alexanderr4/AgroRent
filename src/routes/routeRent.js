const express = require('express');
const router = express.Router();
const rent= require('../controllers/rent.js');

router.post('/create', rent.rent)
        .get('/getRent', rent.getRent)

module.exports = router; 