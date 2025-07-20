const express = require("express");
const router = express.Router({ mergeParams: true }); // In Express, when using a nested router, 
// the mergeParams: true option is necessary to access route parameters defined in the parent router.
// The :id param (campground id) is defined in the parent route (/campgrounds/:id/reviews)
// But inside this router file, we're using router.post("/") or router.delete("/:reviewId") — which doesn't define :id again
// So, by default, Express would not include req.params.id in this nested router unless mergeParams is set to true.
const catchAsync = require('../utils/catchAsync'); // Utility function to wrap async route handlers and catch errors
const Campground = require("../models/campground"); // Import the Campground model
const Review = require("../models/review"); // Import the Review model
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware")


router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    // Create a new review for a specific campground
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "New review created!") // Flash msg
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    // Delete a specific review from a campground
    // First remove reference from campground's reviews array, then delete the review itself
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) // $pull operator removes an element from an array inside a document.
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review successfully deleted!")
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
