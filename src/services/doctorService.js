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

            //console.log('------------', inputData); return;
            if (!inputData.doctorId || !inputData.contentMarkdown || !inputData.contentHTML || !inputData.action) {
                //console.log(inputData, 11, '---------'); return;
                resolve({
                    errCode: 1,
                    errMessage: 'Missing paramater'
                })
            }
            else {
                //console.log(inputData.action, '---------'); return;
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
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getALLDoctor: getALLDoctor,
    saveInforDoctor: saveInforDoctor,
    getDetailDoctorById: getDetailDoctorById

}