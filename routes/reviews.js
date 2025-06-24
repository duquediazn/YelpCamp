const express = require("express");
const router = express.Router({ mergeParams: true }); // In Express, when using a nested router, 
// the mergeParams: true option is necessary to access route parameters defined in the parent router.
// The :id param (campground id) is defined in the parent route (/campgrounds/:id/reviews)
// But inside this router file, we're using router.post("/") or router.delete("/:reviewId") — which doesn't define :id again
// So, by default, Express would not include req.params.id in this nested router unless mergeParams is set to true.
const catchAsync = require('../utils/catchAsync'); // Utility function to wrap async route handlers and catch errors
const ExpressError = require("../utils/ExpressError"); // Custom error class to handle HTTP errors with status codes
const Campground = require("../models/campground"); // Import the Campground model
const Review = require("../models/review"); // Import the Review model
const { reviewSchema } = require("../schemas") // Import the Joi schema used for validating campground input

// Validations
const validateReview = (req, res, next) => {
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

router.post("/", validateReview, catchAsync(async (req, res) => {
    // Create a new review for a specific campground
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "New review created!") // Flash msg
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete("/:reviewId", catchAsync(async (req, res) => {
    // Delete a specific review from a campground
    // First remove reference from campground's reviews array, then delete the review itself
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) // $pull operator removes an element from an array inside a document.
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review successfully deleted!")
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
