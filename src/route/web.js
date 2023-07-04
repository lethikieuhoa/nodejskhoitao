//import express from "express";
const homeController = require('../controllers/homeController');
const express = require('express');
let router = express.Router();
let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUDPage);
    router.get('/hana', (req, res) => {
        return res.send('Hello world hana');
    });
    router.post('/post-crud', homeController.postCRUDPage);
    router.get('/get-crud', homeController.displayGetCRUDPage);
    return app.use("/", router);
}
module.exports = initWebRoutes;