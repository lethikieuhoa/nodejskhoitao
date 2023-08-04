var bcrypt = require('bcryptjs');
const db = require('../models/index');
let getMarkdownByIdDoctor = (idDoctor) => {
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
                let data = await db.Markdown.findOne({
                    where: { doctorId: idDoctor },
                    raw: true
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
    getMarkdownByIdDoctor: getMarkdownByIdDoctor
}