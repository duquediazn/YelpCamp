const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds"); // Import the campgrounds controllers
const catchAsync = require('../utils/catchAsync'); // Utility function to wrap async route handlers and catch errors
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware")
/* https://github.com/expressjs/multer
Multer adds a body object and a file or files object to the request object. 
The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.*/
const multer = require('multer');
const { storage } = require('../cloudinary'); // Cloudinary storage config
const upload = multer({ storage });

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;