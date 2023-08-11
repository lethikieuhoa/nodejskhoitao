var bcrypt = require('bcryptjs');
const db = require('../models/index');
require('dotenv').config();
let postBookAppointment = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing paramater'
                })
            }
            else {//upsert patient
                let [user, status_create] = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        address: data.address,
                        phonenumber: data.phoneNumber,
                        firstName: data.fullName,
                        gender: data.gender
                    }
                });
                //create booking record
                if (user) {
                    await db.Booking.findOrCreate({
                        where: { patientid: user.id, statusId: 'S1' },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientid: user.id,
                            date: data.date,
                            timeType: data.timeType
                        }
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor user accout succeed!'
                });
            }

            let infor = await patientService.postBookAppointment(req.body);
            return res.status(200).json(infor);
        } catch (e) {
            reject(e);
        }
    })

}
module.exports = {
    postBookAppointment: postBookAppointment
}