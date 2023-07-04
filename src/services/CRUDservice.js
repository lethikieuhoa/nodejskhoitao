var bcrypt = require('bcryptjs');
const db = require('../models/index');
const salt = bcrypt.genSaltSync(10);
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            let temp = {
                email: data.email,
                password: hashPasswordFromBcrypt,//data.phonenumber
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId
            };
            //resolve(temp)
            await db.User.create(temp);
            resolve('ok create a new user succeed!');
        } catch (e) {
            reject(e);
        }
    });

}
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {

            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
}
let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({ raw: true });
            resolve(users);
        } catch (e) {
            reject(e);

        }
    });
}
module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser
}