const clinicService = require('../services/clinicService.js');
let getAllClinics = async (req, res) => {
    try {
        let doctors = await clinicService.getAllClinics();
        return res.status(200).json(doctors);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errorCode: -1,
            errMessage: ' Error from server...'
        });
    }
}
let createNewClinic = async (req, res) => {
    try {
        let infor = await clinicService.createNewClinic(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        return res.status().json({
            errorCode: -1,
            errMessage: ' Error from server...'
        })
    }
}
let getDetailClinicById = async (req, res) => {
    try {
        let infor = await clinicService.getDetailClinicById(req.query.id);
        return res.status(200).json(infor);
    } catch (e) {
        return res.status().json({
            errorCode: -1,
            errMessage: ' Error from server...'
        })
    }
}
module.exports = {
    createNewClinic: createNewClinic,
    getAllClinics: getAllClinics,
    getDetailClinicById: getDetailClinicById
}