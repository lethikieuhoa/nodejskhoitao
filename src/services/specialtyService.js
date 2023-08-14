var bcrypt = require('bcryptjs');
const db = require('../models/index');
let getAllSpecialties = () => {
    //console.log(1111); return;
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = await db.Specialty.findAll();
            if (specialties && specialties.length > 0) {
                specialties.map(item => {
                    item.image = new Buffer.from(item.image, 'base64').toString('binary');
                });
            }
            resolve({
                errCode: 0,
                data: specialties
            })
        } catch (e) {
            reject(e)
        }
    })
}
let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML
                || !data.descriptionmarkDown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing paramater'
                })
            }
            else {
                await db.Specialty.create({
                    name: data.name,
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
let getDetailSpecialtyById = (idInput, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing paramater'
                })
            }
            else {
                let data = await db.Specialty.findOne({
                    where: { id: idInput },
                    attributes: ['descriptionHTML', 'name']
                });
                if (data) {
                    let docSpecialties = {};
                    if (location === 'ALL') {
                        docSpecialties = await db.Doctor_Infor.findAll({
                            where: { specialtyId: idInput },
                            attributes: ['doctorId', 'provinceId']
                        });
                    }
                    else {
                        docSpecialties = await db.Doctor_Infor.findAll({
                            where: { specialtyId: idInput, provinceId: location },
                            attributes: ['doctorId', 'provinceId']
                        });
                    }
                    data.docSpecialties = docSpecialties;
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
    createNewSpecialty: createNewSpecialty,
    getAllSpecialties: getAllSpecialties,
    getDetailSpecialtyById: getDetailSpecialtyById
}