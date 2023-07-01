//import express from "express";
const express = require('express');
let configViewEngine = (app) => {
    app.use(express.static("./src/public"));//cau hinh duong link static
    app.set("view engine", "ejs");//jsp, blade
    app.set("views", "./src/views");

}
module.exports = configViewEngine;