const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

// router.post('/signup', (req, res, next) => {
//     res.status(201).json({
//         message: 'Users needs to login here'
//     });
// })

module.exports = router;