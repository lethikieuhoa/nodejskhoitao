var bcrypt = require('bcryptjs');
const db = require('../models/index');
const salt = bcrypt.genSaltSync(10);
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email', 'firstName', 'lastName', 'roleId', 'password'],
                    raw: true
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password); // false
                    delete user.password;
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "Ok";
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }
                }
                else {
                    userData.errCode = 2;
                    userData.errMessage = "User isn't not found";

                }


            }
            else {
                userData.errCode = 1;
                userData.errMessage = "Your email isn't exist in the system.plz try other email.";

            }
            resolve(userData);
        } catch (e) {

            reject(e);

        }
    });
}
let compareUserPassword = () => {
    return new Promise(async (resolve, reject) => {
        try {

        } catch (e) {
            reject(e);

        }
    });
}
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            });
            if (user) {
                resolve(true);
            }
            else {
                resolve(false);
            }

        } catch (e) {
            reject(e);
        }
    })
}
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId == 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });
            }
            else if (userId) {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                });
            }
            resolve(users);
        } catch (e) {
            reject(e)

        }
    })
}
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check Email is exist
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used,plz try another email.'
                })
            }
            else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                let temp = {
                    email: data.email,
                    password: hashPasswordFromBcrypt,//data.phonenumber
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId
                };
                //resolve(temp)
                await db.User.create(temp);
                resolve({
                    errCode: 0,
                    errMessage: 'Add new user success!'
                });
            }

        } catch (e) {
            reject(e);
        }
    })
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
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { id: userId } });
            if (user) {
                await db.User.destroy({
                    where: { id: userId }
                });
                resolve({
                    errCode: 0,
                    errMessage: 'The user is deleted'
                });
            }
            else {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't exist`
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                return res.status(200).json({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            let user = await db.User.findOne({ where: { id: data.id }, raw: false });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                // await db.User.save({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     address: data.address
                // });
                resolve({
                    errCode: 0,
                    errMessage: 'The user is deleted'
                });
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: `The user not found.`
                });
            }

        } catch (e) {
            reject(reject);
        }
    })
}
let getAllCodeService = (typeInPut) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!typeInPut) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            }
            else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInPut }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }

        } catch (e) {
            reject(e)

        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    updateUserData: updateUserData,
    deleteUser: deleteUser,
    getAllCodeService: getAllCodeService
}