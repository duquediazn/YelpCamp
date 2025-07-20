const { campgroundSchema } = require("./schemas") // Import the Joi schema used for validating campground input
const ExpressError = require("./utils/ExpressError"); // Custom error class to handle HTTP errors with status codes
const Campground = require("./models/campground");
const Review = require("./models/review");
const { reviewSchema } = require("./schemas") // Import the Joi schema used for validating campground input

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

//Middleware to validate a Campground
module.exports.validateCampground = (req, res, next) => {
    // Validate the request body against the Joi schema
    const { error } = campgroundSchema.validate(req.body)

    if (error) {
        // If validation fails, extract and join all error messages
        const msg = error.details.map(el => el.message).join(',')
        // Throw a custom ExpressError with status 400 (Bad Request)
        throw new ExpressError(msg, 400)
    } else {
        // If validation passes, continue to the next middleware/route handler
        next()
    }
}

// Middleware to validate a Review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)

    if (error) {
        // If validation fails, extract and join all error messages
        const msg = error.details.map(el => el.message).join(',')
        // Throw a custom ExpressError with status 400 (Bad Request)
        throw new ExpressError(msg, 400)
    } else {
        // If validation passes, continue to the next middleware/route handler
        next()
    }
}

//Middleware for authorization: checks if the current user is the author of a given campground
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


//Middleware for authorization: checks if the current user is the author of a given review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

