const express = require('express');
const router = express.Router();
const users= require('../controllers/users.js');

router.get('/users', users.getUsers)
        .post('/create', users.createUsers);
        
module.exports = router; 