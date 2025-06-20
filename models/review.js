const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number
    // No reverse reference to Campground (unidirectional relation)
    // Reviews are linked from Campground side only
});

module.exports = mongoose.model("Review", reviewSchema);
