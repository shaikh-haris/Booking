const express = require("express");
const routes = express.Router();

const wrapAsync = require("../utils/warp");
const passport = require("passport");
const { savedRedirectUrl } = require("../middelware");
const {
  signup,
  renderSignupForm,
  renderLoginForm,
  login,
  logout,
} = require("../controllers/users");

routes.route("/signup").get(renderSignupForm).post(wrapAsync(signup));

routes
  .route("/login")
  .get(renderLoginForm)
  .post(
    savedRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    login
  );

routes.get("/logout", logout);

module.exports = routes;
