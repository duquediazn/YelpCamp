const express = require("express");
const router = express.Router();
const User = require("../models/user");
const users = require("../controllers/users")
const passport = require("passport");
const { storeReturnTo } = require('../middleware'); // import the storeReturnTo function

router.route("/register")
  .get(users.renderRegister)
  .post(users.createUser);

router.route("/login")
  .get(users.renderLogin)
  .post(
    storeReturnTo, // Use the storeReturnTo middleware to save the returnTo value from session to res.locals
    passport.authenticate("local", { // Real login
      failureFlash: true,            // Show flash message on failed login
      failureRedirect: "/login"      // Redirect back to login page if authentication fails
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;

