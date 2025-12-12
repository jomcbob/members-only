const { addUser } = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");


function renderSignupGet(req, res) {
  res.render("signup", { title: "Sign Up" });
}

const validateUser = [
  body("password")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Password length must be between 1 and 20 characters"),
  body("confPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

async function signupUserPost(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("signup", { errors: errors.array(), title: "Sign Up" });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await addUser(req.body.username, hashedPassword, req.body.firstname, req.body.lastname);
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = {
  renderSignupGet,
  signupUserPost,
  validateUser,
};