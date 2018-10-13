const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true, unique: true },
    password: {type: String, required: true},
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', default: null }
});

module.exports = mongoose.model('User', userSchema);