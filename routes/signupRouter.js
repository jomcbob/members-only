const { Router } = require("express");
const signupController = require("../controllers/signupController");
const signupRouter = Router();
const { validateUser } = signupController;

signupRouter.get("/", signupController.renderSignupGet);
signupRouter.post("/", validateUser, signupController.signupUserPost);

module.exports = { signupRouter }