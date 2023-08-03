const doctorService = require('../services/doctorService');
let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let doctors = await doctorService.getTopDoctorHome(+limit);
        // console.log();
        return res.status(200).json(doctors);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errorCode: -1,
            message: ' Error from server...'
        });
    }

}
let getALLDoctor = async (req, res) => {
    try {
        let doctors = await doctorService.getALLDoctor();
        return res.status(200).json(doctors)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errorCode: -1,
            message: ' Error from server...'
        });
    }
}
let postInforDoctor = async (req, res) => {
    try {
        let result = await doctorService.saveInforDoctor(req.body);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errorCode: -1,
            message: ' Error from server...'
        });
    }
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getALLDoctor: getALLDoctor,
    postInforDoctor: postInforDoctor
}