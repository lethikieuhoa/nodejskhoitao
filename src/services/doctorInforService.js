var bcrypt = require('bcryptjs');
const db = require('../models/index');
let getDoctorInforByIdDoctor = (idDoctor) => {
    //console.log('asdasdad', idDoctor); return;
    return new Promise(async (resolve, reject) => {
        try {
            if (!idDoctor) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required paramater!'
                })
            }
            else {
                let data = await db.Doctor_Infor.findOne({
                    where: { doctorId: idDoctor },
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
                    ],
                    raw: true,
                    nest: true
                });
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
    getDoctorInforByIdDoctor: getDoctorInforByIdDoctor

}