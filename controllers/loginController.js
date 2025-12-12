const passport = require("passport");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return next(new Error('User not authenticated'));
  }
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isadmin) {
    return next();
  } else {
    return next(new Error('User not authorized as admin'));
  }
}


function renderLogInGet(req, res) {
  res.render("login", { title: "Log in" });
}

function logInPost(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })(req, res, next);
}

module.exports = {
  renderLogInGet,
  logInPost,
  isAuthenticated,
  isAdmin
};