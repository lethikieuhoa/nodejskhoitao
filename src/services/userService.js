var bcrypt = require('bcryptjs');
const db = require('../models/index');
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email', 'roleId', 'password'],
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
module.exports = {
    handleUserLogin: handleUserLogin
}