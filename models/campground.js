const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review")

const ImageSchema = new Schema({
  url: String,
  filename: String
})

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
})

/* By default Mongoose does not include virtuals when converting a document to JSON. 
To include virtuals we need to set the toJSON schema option to true and pass it as an argument.*/
const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: { // GeoJSON format
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  price: Number,
  description: String,
  location: String,
  // Stored as array of ObjectId references
  // Works well for small to moderate number of reviews/users (e.g., < 30)
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
}, opts /*To include the virtual popUpMarkup*/);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong><p>${this.description.substring(0, 30)}...</p>`
})

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
