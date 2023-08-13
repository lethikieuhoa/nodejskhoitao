const patientService = require('../services/specialtyService.js');
let createNewSpecialty = async (req, res) => {
    try {
        let infor = await patientService.createNewSpecialty(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        return res.status().json({
            errorCode: -1,
            errMessage: ' Error from server...'
        })
    }
}
module.exports = {
    createNewSpecialty: createNewSpecialty
}