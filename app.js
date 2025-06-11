const express = require("express"); // Import the Express framework
const path = require("path"); // Node module to handle file paths
const mongoose = require("mongoose"); // Import Mongoose, an ODM library for MongoDB
const engine = require("ejs-mate") // Import ejs-mate, Express 4.x layout, partial template functions for the EJS template engine. Docs: https://github.com/JacksonTian/ejs-mate
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

// Routes
app.get("/", (req, res) => {
  // Main route, welcome message
  res.send("Hello from YelpCamp!");
});

app.get("/campgrounds", async (req, res) => {
  // List all campgrounds
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  // Form to create a new campground
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  // Create a new campground
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  // Details of a specific campground
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  //Form to edit a specific campground
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  //Edit a specific campground
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  //Delete a specific campground
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
