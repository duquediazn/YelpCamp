const express = require("express"); // Import the Express framework
const path = require("path"); // Node module to handle file paths
const mongoose = require("mongoose"); // Import Mongoose, an ODM library for MongoDB
const engine = require("ejs-mate") // Import ejs-mate, Express 4.x layout, partial template functions for the EJS template engine. Docs: https://github.com/JacksonTian/ejs-mate
const { campgroundSchema } = require("./schemas") // Import the Joi schema used for validating campground input
const catchAsync = require('./utils/catchAsync'); // Utility function to wrap async route handlers and catch errors
const ExpressError = require("./utils/ExpressError"); // Custom error class to handle HTTP errors with status codes
const methodOverride = require("method-override"); // Import method-override to enable HTTP verbs like PUT and DELETE in forms
const Campground = require("./models/campground"); // Import the Campground model

// Database connection
mongoose.connect("mongodb://localhost:27017/yelp-camp");

// Error handling for the connection
const db = mongoose.connection; // Active Mongoose connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Express app initialization
const app = express();

// Configuration
app.engine('ejs', engine)  // Use ejs-mate as the rendering engine for EJS templates
app.set("view engine", "ejs"); // Set EJS as the templating engine
app.set("views", path.join(__dirname, "views")); // Define the folder where the views are located

app.use(express.urlencoded({ extended: true })); // Use middleware to parse URL-encoded data (like form submissions)
app.use(methodOverride("_method")); // Use method-override to interpret the "_method" query parameter as the actual HTTP method

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


// npm i bootstrap@5.3.6 (latest version 11/06/25)
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist'))); // Serve Bootstrap's CSS and JS files from node_modules at the /bootstrap URL path

// Routes
app.get("/", (req, res) => {
  // Main route, welcome message
  res.send("Hello from YelpCamp!");
});

app.get("/campgrounds", catchAsync(async (req, res, next) => {
  // List all campgrounds
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
}));

app.get("/campgrounds/new", (req, res) => {
  // Form to create a new campground
  res.render("campgrounds/new");
});

app.post("/campgrounds", validateCampground, catchAsync(async (req, res) => {
  // Create a new campground
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.get("/campgrounds/:id", catchAsync(async (req, res) => {
  // Details of a specific campground
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
}));

app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
  //Form to edit a specific campground
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
}));

app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res) => {
  //Edit a specific campground
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
  //Delete a specific campground
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
}));

app.all(/(.*)/, (req, res, next) => {
  // Catch-all route for any non-matching paths
  // Creates a 404 error and passes it to the error handler
  next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
  // Global error handler middleware
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!"
  res.status(statusCode).render("./error", { err });
})

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
