var bcrypt = require('bcryptjs');
const db = require('../models/index');
const emailService = require('./emailService.js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}
let postBookAppointment = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date
                || !data.timeType || !data.fullName
                || !data.timeString || !data.language
                || !data.doctorName
                || !data.gender
                || !data.address || !data.birthday) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing paramater'
                })
            }
            else {//upsert patient
                // buildUrlEmail(data.doctorId);
                // return;
                let token = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    redirectLink: buildUrlEmail(data.doctorId, token),
                    language: data.language
                });
                let [user, status_create] = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        address: data.address,
                        phonenumber: data.phoneNumber,
                        firstName: data.fullName,
                        gender: data.gender,
                        birthday: data.birthday
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
                            timeType: data.timeType,
                            token: token,
                            reason: data.reason
                        }
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor user accout succeed!'
                });
            }
        } catch (e) {
            reject(e);
        }
    })

}
let postVerifyAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing paramater'
                })
            }
            else {
                // console.log(appointment); return;
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                });
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Update the appointment succeed."
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment has been activated or does not exist."
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyAppointment: postVerifyAppointment
}