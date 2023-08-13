//import express from "express";
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const doctorController = require('../controllers/doctorController');
const markdownController = require('../controllers/markdownController');
const doctorInforController = require('../controllers/doctorInforController');
const patientController = require('../controllers/patientController');
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
    router.get('/api/get-all-user', userController.handleGetAllUser);
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctor', doctorController.getALLDoctor);
    router.post('/api/save-infor-doctor', doctorController.postInforDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate)

    router.get('/api/get-markdown-by-id-doctor', markdownController.getMarkdownByIdDoctor);
    router.get('/api/get-doctor-infor-by-id-doctor', doctorInforController.getdoctorInforByIdDoctor);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);

    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyAppointment);

    return app.use("/", router);


}
module.exports = initWebRoutes;