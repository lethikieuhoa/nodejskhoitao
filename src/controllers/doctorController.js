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
            errMessage: ' Error from server...'
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
            errMessage: ' Error from server...'
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
            errMessage: ' Error from server...'
        });
    }
}
let getDetailDoctorById = async (req, res) => {
    try {
        if (!req.query.id) {
            return res.status(200).json({
                errorCode: -1,
                errMessage: 'Missing req.query.id'
            })
        }
        let infor = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errorCode: -1,
            errMessage: ' Error from server...'
        })

    }
}
let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errorCode: -1,
            errMessage: ' Error from server...'
        })
    }
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getALLDoctor: getALLDoctor,
    postInforDoctor: postInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule
}