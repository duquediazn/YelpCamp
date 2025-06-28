const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require('../middleware'); // import the storeReturnTo function

// GET route to display the registration form
router.get("/register", (req, res) => {
  res.render("users/register");
});

// POST route to handle the registration form submission
router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      // Create a new User instance (without the password yet)
      const user = new User({ email, username });
      // Register the user and securely store their password (uses hashing and salting)
      const regiseredUser = await User.register(user, password);
      req.login(regiseredUser, err => {
        if (err) return next(err)
        // Show success message and redirect to the campgrounds page
        req.flash("success", "Welcome to YelpCamp!");
        res.redirect("/campgrounds");
      })
    } catch (e) {
      // If an error occurs (e.g., user already exists), show error message and redirect
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

// GET route to display the login form
router.get("/login", (req, res) => {
  res.render("users/login");
});

// POST route to process login form using Passport's local strategy
router.post(
  "/login",
  storeReturnTo, // Use the storeReturnTo middleware to save the returnTo value from session to res.locals
  passport.authenticate("local", {
    failureFlash: true,            // Show flash message on failed login
    failureRedirect: "/login"      // Redirect back to login page if authentication fails
  }),
  (req, res) => {
    // If login is successful, show welcome message and redirect
    req.flash("success", "Welcome back!");
    const redirectUrl = req.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
  }
);

// GET route to log the user out
router.get("/logout", (req, res, next) => {
  // Passport's logout function (asynchronous in newer versions)
  req.logout(function (err) {
    if (err) {
      return next(err); // Pass error to error-handling middleware
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;

