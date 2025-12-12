const { Router } = require("express");
const messageController = require("../controllers/messageController");
const messageRouter = Router();
const { isAdmin } = require("../controllers/loginController")

messageRouter.get("/new", messageController.renderMessageGet);
messageRouter.post("/new", messageController.addPostPost);
messageRouter.get("/:id", messageController.showMessageByIdGet);
messageRouter.get("/:id/delete", isAdmin, messageController.renderDeleteMessageGet);
messageRouter.get("/:id/delete/yes", isAdmin, messageController.deletePostGet);

module.exports = { messageRouter }