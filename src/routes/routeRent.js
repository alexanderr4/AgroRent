const express = require('express');
const router = express.Router();
const rent= require('../controllers/rent.js');

router.post('/create', rent.rent)
        .get('/getRentUser', rent.getRentdUser)
        .get('/filterRequestedUserId', rent.getRentRequestedUser)

module.exports = router; 