const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    major: {type: String, required: true}
});

module.exports = mongoose.model('Resume', resumeSchema);