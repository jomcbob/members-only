const { Router } = require("express");
const signupController = require("../controllers/signupController");
const signupRouter = Router();
const { validateUser } = signupController;
const { isAuthenticated } = require("../controllers/loginController")

signupRouter.get("/", signupController.renderSignupGet);
signupRouter.post("/", validateUser, signupController.signupUserPost);
signupRouter.get("/info", signupController.renderInfoGet);
signupRouter.get("/member", isAuthenticated, signupController.renderBecomeMemberGet);
signupRouter.get("/admin", isAuthenticated, signupController.renderBecomeAdminGet);
signupRouter.post("/member", isAuthenticated, signupController.signUpMemberPost);
signupRouter.post("/admin", isAuthenticated, signupController.signUpAdminPost);

module.exports = { signupRouter }