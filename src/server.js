const express = require('express');
//import express from "express";
const bodyParser = require('body-parser');
//import bodyParser from "body-parser";
const viewEngine = require('./config/viewEngine');
//import viewEngine from './config/viewEngine';
//import initWebRoutes from './route/web';
const initWebRoutes = require('./route/web');
const connectDB = require('./config/connectDB');
//const cors = require('cors');
require('dotenv').config();
let app = express();
// const corsOptions = {
//     origin: 'http://192.168.1.5:3000',

//     withCredentials: true
//     /* methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
//      allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
//      */
// }
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.URL_REACT);
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    //res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});
//config App
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;
//Port ===undefined => port = 69696

app.listen(port, () => {
    //callback
    console.log("Backend Nodejs is running on the port :" + port)
})
