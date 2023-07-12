//import db from '../models/index';
const db = require('../models/index');
const CRUDservice = require('../services/CRUDservice');
let getHomePage = async (req, res) => {
    // return res.send("Hello world from controller");//trong chính trang controller
    //return res.render("homepage.ejs");//trong view
    try {
        let data = await db.User.findAll();
        //console.log('aa');
        //console.log(data);
        return res.render("homepage.ejs", {
            data: JSON.stringify(data)
        });//trong view
    } catch (e) {
        console.log(e);
    }
}
let getAboutPage = (req, res) => {
    return res.render("test/about.ejs");
}
let getCRUDPage = (req, res) => {
    return res.render('crud.ejs');
}
let postCRUDPage = async (req, res) => {
    let ms = await CRUDservice.createNewUser(req.body);
    console.log(ms);
    console.log(req.body);
    return res.send('post CRUD');
}
let displayGetCRUDPage = async (req, res) => {
    let data = await CRUDservice.getAllUser();

    return res.render('displayCRUD.ejs', { dataTable: data });
}
let geteditCRUDPage = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDservice.getUserInfoById(userId);
        console.log('----------------------');
        console.log(userData);
        console.log('----------------------');
        return res.render('editCRUD.ejs', {
            dataEdit: userData
        });
    }
    else {
        return res.send('Users not found');
    }
}
let putCRUDPage = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDservice.updateUserData(data);


    return res.render('displayCRUD.ejs', { dataTable: allUsers });
}
let deleteCRUDPage = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        await CRUDservice.deleteUserById(userId);
        return res.send('delete succeed');
    }
    else {
        return res.send("User's not found");
    }


}
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUDPage: getCRUDPage,
    postCRUDPage: postCRUDPage,
    displayGetCRUDPage: displayGetCRUDPage,
    geteditCRUDPage: geteditCRUDPage,
    putCRUDPage: putCRUDPage,
    deleteCRUDPage: deleteCRUDPage
}