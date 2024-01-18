require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const accountRoutes = require('./routes/accounts');
const moduleRoutes = require('./routes/modules');
const rateRoutes = require('./routes/rates');
const lessonRoutes = require('./routes/lessons');

// express app
const app = express()

// middlewear
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
});

// routes
app.use('/api/account', accountRoutes);
app.use('/api/module', moduleRoutes);
app.use('/api/rate', rateRoutes);
app.use('/api/lesson', lessonRoutes);

// connect to DB
mongoose.connect(process.env.MONGODB_URI).then(() => {
    // listen for request
    app.listen(process.env.PORT, () => {
        console.log('Connected to DB and listeneing on port : ' + process.env.PORT);
    })
}).catch((error) => {
    console.log(error);
});