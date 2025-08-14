const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds"); // Import the campgrounds controllers
const catchAsync = require('../utils/catchAsync'); // Utility function to wrap async route handlers and catch errors
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware")

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;