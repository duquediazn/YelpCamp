const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync'); // Utility function to wrap async route handlers and catch errors
const ExpressError = require("../utils/ExpressError"); // Custom error class to handle HTTP errors with status codes
const Campground = require("../models/campground"); // Import the Campground model
const { campgroundSchema } = require("../schemas") // Import the Joi schema used for validating campground input

//Validation
const validateCampground = (req, res, next) => {
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

router.get("/", catchAsync(async (req, res, next) => {
    // List all campgrounds
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

router.get("/new", (req, res) => {
    // Form to create a new campground
    res.render("campgrounds/new");
});

router.post("/", validateCampground, catchAsync(async (req, res) => {
    // Create a new campground
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully made a new campground!") // Flash msg
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get("/:id", catchAsync(async (req, res) => {
    // Details of a specific campground
    const campground = await Campground.findById(req.params.id).populate("reviews");
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });

}));

router.get("/:id/edit", catchAsync(async (req, res) => {
    //Form to edit a specific campground
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
}));

router.put("/:id", validateCampground, catchAsync(async (req, res) => {
    //Edit a specific campground
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:id", catchAsync(async (req, res) => {
    //Delete a specific campground
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground successfully deleted!")
    res.redirect("/campgrounds");
}));

module.exports = router;