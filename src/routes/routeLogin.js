const express = require('express');
const router = express.Router();
const perLogin= require('../controllers/login.js');

router.post('/login', perLogin.login)
        .post('/recovery',perLogin.recoverPassword)
        
module.exports = router; 