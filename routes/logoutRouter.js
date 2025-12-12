const { Router } = require("express");
const logoutController = require("../controllers/logoutController");
const logoutRouter = Router();

logoutRouter.get("/", logoutController.logOutGet);

module.exports = { logoutRouter }