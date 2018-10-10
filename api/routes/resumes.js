const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Resume = require('../models/resume');

// Get all
router.get('/', (req, res, next) => {
    Resume.find()
        .exec()
        .then(resumes => {
            const response = {
                count: resumes.count,
                resumeList: resumes.map(resume => {
                    return {
                        name: resume.name,
                        major: resume.major,
                        _id: resume._id
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// router.post('/', (req, res, next) => {
//     const newRes
// });

module.exports = router;
