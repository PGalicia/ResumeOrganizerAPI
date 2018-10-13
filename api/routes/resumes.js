const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/checkAuth');

const Resume = require('../models/resume');
const User = require('../models/user');

// Get all the resume -- the user COMPANY is the only user to access this route.
router.get('/', checkAuth.company, (req, res, next) => {
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

// Get the specified resume -- the user USER is the only user to access this route.
router.get('/:resumeID', checkAuth.user, (req, res, next) => {
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

// Create a new resume -- the user USER is the only user to access this route.
router.post('/', checkAuth.user, (req, res, next) => {
    // Holds the specified user
    let selectedUser = null;
    // Task: Only allow a user to create a resume if they don't already have any
    // Find the specified user
    User.findOne({ username: req.body.username })
        .exec()
        .then(user => {
            // if user does not exists, throw an error
            if(!user) throw "Username provided does not exist";
            // If the user already has a resume throw error
            if(user.resume) throw "There is already a resume associated with the given username";
            // If user does not have a resume, make one
            return user;
        })
        .then(user => {
            const id = new mongoose.Types.ObjectId();
            const resume = new Resume({
                _id: id,
                username: req.body.username,
                name: req.body.name,
                major: req.body.major
            });
            selectedUser = user;
            return resume.save();
        })
        .then(result => {
            console.log(result);
            // Update the User's resume ID
            User.updateOne({ _id: selectedUser._id }, { $set: { resume: result._id }}).exec();
            res.status(201).json({
                message: "Resume succesfully added!",
                createdResume: {
                    name: result.name,
                    username: result.username,
                    major: result.major,
                    _id: result._id
                }
            });
        })
        .catch(err => {
            // Task: ensure that there are multiple res status - base it on the type of error
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// Edit an existing resume -- the user USER is the only user to access this route.
router.patch('/:resumeID', checkAuth.user, (req, res, next) => {
    const _id = req.params.resumeID;
    const updateCategory = {};
    for(const category of req.body) {
        updateCategory[category.propName] = category.value
    }
    Resume.update({_id}, { $set: updateCategory })
        .exec()
        .then(resume => {
            // Task: If the user tries to change the username, throw error
            console.log(resume);
            res.status(200).json({message: "Product Updated!"})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

// Delete a resume -- the user ADMIN is the only user to access this route.
router.delete('/:resumeID', checkAuth.admin, (req, res, next) => {
    // Holds the specified user
    let selectedUser = null;
    // Task: also reset the resume property of the user
    User.findOne({ username: req.body.username })
        .exec()
        .then(user => {
            // if user does not exists, throw an error
            if(!user) throw "Username provided does not exist";
            // If the user does not have a resume under their name throw error
            if(!user.resume) throw "This user does not have a resume under the specified ID";
            // If user does not have a resume, make one
            return user;
        })
        .then(user => {
            const _id = req.params.resumeID;
            selectedUser = user;
            return Resume.deleteOne({_id}).exec();
        })
        .then(resume => {
            console.log(resume);
            User.updateOne({ _id: selectedUser._id }, { $set: { resume: null }}).exec();
            res.status(200).json({message: "Resume Deleted"})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});


module.exports = router;
