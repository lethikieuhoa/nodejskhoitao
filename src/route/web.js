//import express from "express";
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
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
    router.get('/edit-crud', homeController.geteditCRUDPage);
    router.post('/put-crud', homeController.putCRUDPage);
    router.get('/delete-crud', homeController.deleteCRUDPage);
    router.post('/api/login', userController.handleLogin);
    return app.use("/", router);


}
module.exports = initWebRoutes;