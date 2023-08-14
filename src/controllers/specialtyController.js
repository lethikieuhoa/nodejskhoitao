const specialtyService = require('../services/specialtyService.js');
let getAllSpecialties = async (req, res) => {
    try {
        let doctors = await specialtyService.getAllSpecialties();
        return res.status(200).json(doctors);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errorCode: -1,
            errMessage: ' Error from server...'
        });
    }
}
let createNewSpecialty = async (req, res) => {
    try {
        let infor = await specialtyService.createNewSpecialty(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        return res.status().json({
            errorCode: -1,
            errMessage: ' Error from server...'
        })
    }
}
let getDetailSpecialtyById = async (req, res) => {
    try {
        let infor = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location);
        return res.status(200).json(infor);
    } catch (e) {
        return res.status().json({
            errorCode: -1,
            errMessage: ' Error from server...'
        })
    }
}
module.exports = {
    createNewSpecialty: createNewSpecialty,
    getAllSpecialties: getAllSpecialties,
    getDetailSpecialtyById: getDetailSpecialtyById
}