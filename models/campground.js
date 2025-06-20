const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review")

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  // One-to-many: one Campground has many Reviews
  // Stored as array of ObjectId references
  // Works well for small to moderate number of reviews (e.g., < 30)
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

// Cascade delete middleware:
// This middleware removes all the reviews of a given campground after the campground itself has been deleted
CampgroundSchema.post("findOneAndDelete", async function (doc) { // Only .findByIdAndDelete() triggers this middleware
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})


module.exports = mongoose.model("Campground", CampgroundSchema);
