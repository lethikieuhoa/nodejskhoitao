var bcrypt = require('bcryptjs');
const db = require('../models/index');
require('dotenv').config();
const _ = require('lodash');
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {

            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [
                    ['createdAt', 'DESC']
                ],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {
                        model: db.Allcode,
                        as: 'positionData',
                        attributes: ['valueEn', 'valueVi']
                    },
                    {
                        model: db.Allcode,
                        as: 'genderData',
                        attributes: ['valueEn', 'valueVi']
                    }
                ],
                raw: true,
                nest: true
            });
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}
let getALLDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: ['id', 'firstName', 'lastName'],
            });
            // console.log('aaa')
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}
let saveInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentMarkdown || !inputData.contentHTML || !inputData.action
                || !inputData.selectedPrice || !inputData.selectedPayment
                || !inputData.selectedProvice || !inputData.nameClinic
                || !inputData.addressClinic
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing paramater'
                })
            }
            else {
                //upsert to Markdown
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    });
                }
                else {
                    //console.log('---'); return;
                    let doctorMarkDown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false,
                    })
                    // console.log('---', doctorMarkDown);
                    if (doctorMarkDown) {
                        doctorMarkDown.contentHTML = inputData.contentHTML;
                        doctorMarkDown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkDown.description = inputData.description;
                        //doctorMarkDown.updateAt = new Date()
                        await doctorMarkDown.save();
                    }

                }
                //upsert to doctor_infor table   
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                });
                if (doctorInfor) {
                    //update  
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.provinceId = inputData.selectedProvice;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    await doctorInfor.save();
                }
                else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvice,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor succeed!'
                });
            }
        } catch (e) {
            reject(e);

        }
    })
}
let getDetailDoctorById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required paramater!'
                })
            }
            else {
                let data = await db.User.findOne({
                    where: { id: idInput },
                    attributes: ['id', 'image', 'firstName', 'lastName'],
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: true,
                    nest: true
                });
                // console.log(data);
                if (data && data.image) {
                    data.image = new Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) { data = {} }
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramater!'
                })
            }
            else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                //console.log('data from bulk', schedule);
                //lay danh sach ton tai trong database
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ['doctorId', 'timeType', 'date', 'maxNumber']
                });
                // if (existing && existing.length > 0) {
                //     existing = existing.map(item => {
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     })
                // }
                //lay danh sach ko ton tai trong database
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date
                });
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
            }


            resolve({
                errCode: 0,
                errMessage: 'OK'
            });
        } catch (e) {
            reject(e);

        }
    })
}
let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                let data = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'timeTypeData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.User,
                            as: 'doctorData',
                            attributes: ['firstName', 'lastName']
                        }
                    ],
                    raw: true,
                    nest: true
                })
                if (!data) data = [];
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);

        }
    })
}
let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                let data = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ['password', 'id']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['contentHTML', 'contentMarkdown', 'description']
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'priceData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode,
                                    as: 'paymentData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode,
                                    as: 'provinceData',
                                    attributes: ['valueEn', 'valueVi']
                                }
                            ]
                        }
                    ],
                    raw: true,
                    nest: true
                });
                //console.log(data)
                if (data && data.image) {
                    //console.log(1111)
                    data.image = new Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) { data = {} }
                resolve({
                    errCode: 0,
                    data: data
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getALLDoctor: getALLDoctor,
    saveInforDoctor: saveInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getProfileDoctorById: getProfileDoctorById

}