const doctorInforService = require('../services/doctorInforService.js');
let getdoctorInforByIdDoctor = async (req, res) => {
    try {
        if (!req.query.idDoctor) {
            return res.status(200).json({
                errorCode: -1,
                errMessage: 'Missing req.query.idDoctor'
            })
        }
        else {
            //console.log(req.query.idDoctor); return;
            let data = await doctorInforService.getDoctorInforByIdDoctor(req.query.idDoctor);
            return res.status(200).json(data);
        }
    } catch (e) {
        return res.status().json({
            errorCode: -1,
            errMessage: ' Error from server...'
        })
    }
}
module.exports = {
    getdoctorInforByIdDoctor: getdoctorInforByIdDoctor
}