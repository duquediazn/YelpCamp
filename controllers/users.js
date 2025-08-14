const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
}

module.exports.createUser = catchAsync(async (req, res) => {
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

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}

module.exports.login = (req, res) => {
    // If login is successful, show welcome message and redirect
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    // Passport's logout function (asynchronous in newer versions)
    req.logout(function (err) {
        if (err) {
            return next(err); // Pass error to error-handling middleware
        }
        req.flash("success", "Goodbye!");
        res.redirect("/campgrounds");
    });
}