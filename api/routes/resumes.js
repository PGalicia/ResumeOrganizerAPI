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

router.get('/:resumeID', (req, res, next) => {
    const _id = req.params.resumeID;
    Resume.findById(_id)
        .select("name major _id")
        .exec()
        .then(resume => {
            console.log("resume", resume);
            res.status(200).json(resume);
        })
        .catch(err => {
            console.log("error", err);
            res.status(500).json(err)
        });
});

router.post('/', (req, res, next) => {
    const resume = new Resume({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        major: req.body.major
    });
    resume.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Resume succesfully added!",
                createdResume: {
                    name: result.name,
                    price: result.major,
                    _id: result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.patch('/:resumeID', (req, res, next) => {
    const _id = req.params.resumeID;
    const updateCategory = {};
    for(const category of req.body) {
        updateCategory[category.propName] = category.value
    }
    Resume.update({_id}, { $set: updateCategory })
        .exec()
        .then(resume => {
            console.log(resume);
            res.status(200).json({message: "Product Updated!"})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

router.delete('/:resumeID', (req, res, next) => {
    const _id = req.params.resumeID;
    Resume.deleteOne({_id})
        .exec()
        .then(resume => {
            console.log(resume);
            res.status(200).json({message: "Resume Deleted"})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


module.exports = router;
