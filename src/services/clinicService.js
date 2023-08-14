var bcrypt = require('bcryptjs');
const db = require('../models/index');
let getAllClinics = () => {
    //console.log(1111); return;
    return new Promise(async (resolve, reject) => {
        try {
            let clinics = await db.Clinic.findAll();
            if (clinics && clinics.length > 0) {
                clinics.map(item => {
                    item.image = new Buffer.from(item.image, 'base64').toString('binary');
                });
            }
            resolve({
                errCode: 0,
                data: clinics
            })
        } catch (e) {
            reject(e)
        }
    })
}
let createNewClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML
                || !data.descriptionmarkDown || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing paramater'
                })
            }
            else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionmarkDown: data.descriptionmarkDown
                });
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (e) {
            reject(e);
        }
    })

}
let getDetailClinicById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing paramater'
                })
            }
            else {
                let data = await db.Clinic.findOne({
                    where: { id: idInput },
                    attributes: ['descriptionHTML', 'name', 'address']
                });
                if (data) {
                    let docClinics = {};

                    docClinics = await db.Doctor_Infor.findAll({
                        where: { clinicId: idInput },
                        attributes: ['doctorId']
                    });

                    data.docClinics = docClinics;
                } else {
                    data = {};
                }
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
    createNewClinic: createNewClinic,
    getAllClinics: getAllClinics,
    getDetailClinicById: getDetailClinicById
}