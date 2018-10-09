const express = require('express');
const router = express.Router();

router.post('/companyLogin', (req, res, next) => {
    res.status(201).json({
        message: 'Companies needs to login here'
    });
})

router.post('/UserLogin', (req, res, next) => {
    res.status(201).json({
        message: 'Users needs to login here'
    });
})

module.exports = router;