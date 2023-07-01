const express = require('express');
//import express from "express";
const bodyParser = require('body-parser');
//import bodyParser from "body-parser";
const viewEngine = require('./config/viewEngine');
//import viewEngine from './config/viewEngine';
//import initWebRoutes from './route/web';
const initWebRoutes = require('./route/web');
const connectDB = require('./config/connectDB');
require('dotenv').config();
let app = express();
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
