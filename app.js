const express = require('express');
const app = express();
const morgan = require('morgan');

const resumeRoutes = require('./api/routes/resumes');
const userRoutes = require('./api/routes/user');

app.use(morgan('dev'));

// Available API Routes
app.use('/resumes', resumeRoutes);
app.use('/user', userRoutes);

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