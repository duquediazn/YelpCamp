const express = require("express");
const router = express.Router({ mergeParams: true }); // In Express, when using a nested router, 
// the mergeParams: true option is necessary to access route parameters defined in the parent router.
// The :id param (campground id) is defined in the parent route (/campgrounds/:id/reviews)
// But inside this router file, we're using router.post("/") or router.delete("/:reviewId") — which doesn't define :id again
// So, by default, Express would not include req.params.id in this nested router unless mergeParams is set to true.
const catchAsync = require('../utils/catchAsync'); // Utility function to wrap async route handlers and catch errors
const reviews = require("../controllers/reviews")
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware")


router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;
