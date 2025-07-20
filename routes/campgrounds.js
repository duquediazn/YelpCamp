const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync'); // Utility function to wrap async route handlers and catch errors
const Campground = require("../models/campground"); // Import the Campground model
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware")

router.get("/", catchAsync(async (req, res, next) => {
    // List all campgrounds
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

router.get("/new", isLoggedIn, (req, res) => {
    // Form to create a new campground
    res.render("campgrounds/new");
});

router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    // Create a new campground
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground!") // Flash msg
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get("/:id", catchAsync(async (req, res) => {
    // Details of a specific campground
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        } //Nested populate
    }).populate('author');
    console.log(campground)
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });

}));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    //Form to edit a specific campground
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
}));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    //Edit a specific campground
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    //Delete a specific campground
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground successfully deleted!")
    res.redirect("/campgrounds");
}));

module.exports = router;