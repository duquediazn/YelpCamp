const Review = require("../models/review");
const Campground = require("../models/campground")

module.exports.createReview = async (req, res) => {
    // Create a new review for a specific campground
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "New review created!") // Flash msg
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    // Delete a specific review from a campground
    // First remove reference from campground's reviews array, then delete the review itself
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) // $pull operator removes an element from an array inside a document.
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review successfully deleted!")
    res.redirect(`/campgrounds/${id}`);
}