// Middleware to check if the user is authenticated before allowing access to a protected route
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Store the original URL the user tried to access (so we can redirect them back after login)
        req.session.returnTo = req.originalUrl;

        // Flash an error message and redirect to the login page
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next(); // User is authenticated, continue to the next middleware or route handler
}

// Middleware to make the return URL (if any) available in the response locals (for use in redirects after login)
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        // Make returnTo available to templates and other middleware
        res.locals.returnTo = req.session.returnTo;
    }
    next(); // Continue to the next middleware or route handler
}
