const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const resumeRoutes = require('./api/routes/resumes');
const userRoutes = require('./api/routes/user');

mongoose.connect(`mongodb+srv://pgalicia:${process.env.MONGO_ATLAS_PW}@resume-organizer-w2ibw.mongodb.net/test?retryWrites=true`, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})) // might not be needed
app.use(bodyParser.json());

// Handle CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

// Available API Routes
app.use('/resumes', resumeRoutes);
// app.use('/user', userRoutes);

// Case for when Routes called are invalid/not found
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;