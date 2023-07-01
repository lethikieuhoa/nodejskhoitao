//import db from '../models/index';
const db = require('../models/index');
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
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage
}