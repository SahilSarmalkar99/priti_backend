const express = require("express");
const authController = require("./auth.controller");
const routes = express.Router();

routes.post("/login" , authController.login);
routes.post("/register" , authController.register);
routes.post("/logout", authController.logout);

module.exports = routes; 