var bcrypt = require('bcryptjs');
const db = require('../models/index');
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
            console.log('aaa')
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
            //console.log('------------', inputData); return;
            if (!inputData.doctorId || !inputData.contentMarkdown || !inputData.contentHTML) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing paramater'
                })
            }
            else {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                });
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
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getALLDoctor: getALLDoctor,
    saveInforDoctor: saveInforDoctor
}