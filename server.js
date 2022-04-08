require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const colors = require('colors')
const morgan = require('morgan');

const app = express();
app.use(express.json());

const mongoURL = process.env.MONGO_URL;
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', ()=>{
    console.log(`Database running...`.cyan.bold);
})

mongoose.connection.on('error', (err)=>{
    console.log(`Error: ${err}`.red.bold)
})

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//Routes
app.use('/api/v1/users', require('./routes/user'))
app.use('/api/v1/courses', require('./routes/course'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server responding in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold)
})
