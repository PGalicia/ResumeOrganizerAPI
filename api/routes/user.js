const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Future plan: ensure that user can edit their password and username

router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(users => {
            const response = {
                count: users.count,
                userList: users.map(user => {
                    return {
                        username: user.username,
                        password: user.password,
                        _id: user._id
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

router.post('/signup', (req, res, next) => {
    User.find({username: req.body.username})
        .exec()
        .then(user => {
            if(user.length >= 1) {
                return res.status(409).json({message: "Username already exists!"});
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err) {
                        return res.status(500).json({error: err})
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hash
                        })
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({messsage: "User created!"})
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({error: err});
                            })
                    }
                })
            }
        });
});

router.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username })
        .exec()
        .then(user => {
            if(user === null) return res.status(401).json({ message: "Auth failed!"});
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(err) return res.status(401).json({ message: "Auth failed!"});
                if(result) {
                    const token = jwt.sign({ username: user.username }, process.env.JWT_KEY, { expiresIn: "1h"});
                    return res.status(200).json({
                        message: "Auth sucessful!",
                        token: token
                    });
                }
                return res.status(401).json({ message: "Auth failed!"})
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });
});

router.delete('/:userID', (req, res, next) => {
    const _id = req.params.userID;
    User.deleteOne({_id})
        .exec()
        .then(user => {
            console.log(user);
            res.status(200).json({message: "User Deleted"})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;