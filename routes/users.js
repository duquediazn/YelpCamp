const express = require("express");
const router = express.Router();
const User = require("../models/user");
const users = require("../controllers/users")
const passport = require("passport");
const { storeReturnTo } = require('../middleware'); // import the storeReturnTo function

// GET route to display the registration form
router.get("/register", users.renderRegister);

// POST route to handle the registration form submission
router.post("/register", users.createUser);

// GET route to display the login form
router.get("/login", users.renderLogin);

// POST route to process login form using Passport's local strategy
router.post(
  "/login",
  storeReturnTo, // Use the storeReturnTo middleware to save the returnTo value from session to res.locals
  passport.authenticate("local", { // Real login
    failureFlash: true,            // Show flash message on failed login
    failureRedirect: "/login"      // Redirect back to login page if authentication fails
  }),
  users.login
);

// GET route to log the user out
router.get("/logout", users.logout);

module.exports = router;

