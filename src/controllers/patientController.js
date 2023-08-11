const patientService = require('../services/patientService.js');
let postBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postBookAppointment(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        return res.status().json({
            errorCode: -1,
            errMessage: ' Error from server...'
        })
    }
}
module.exports = {
    postBookAppointment: postBookAppointment
}