const { Router } = require("express");
const loginController = require("../controllers/loginController");
const loginRouter = Router();

loginRouter.get("/", loginController.renderLogInGet);
loginRouter.post("/", loginController.logInPost);

module.exports = { loginRouter }