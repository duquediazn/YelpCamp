
if (process.env.NODE_ENV != "production") {
  require("dotenv").config(); // Require the environment variables in the .env file if we're in development mode
}

const express = require("express"); // Import the Express framework
const path = require("path"); // Node module to handle file paths
const mongoose = require("mongoose"); // Import Mongoose, an ODM library for MongoDB
const engine = require("ejs-mate"); // Import ejs-mate, Express 4.x layout, partial template functions for the EJS template engine. Docs: https://github.com/JacksonTian/ejs-mate
const session = require("express-session"); // Import middleware to manage user sessions in Express
const flash = require("connect-flash"); // Import package to add flash message support (this middleware depends on sessions)
const ExpressError = require("./utils/ExpressError"); // Custom error class to handle HTTP errors with status codes
const methodOverride = require("method-override"); // Import method-override to enable HTTP verbs like PUT and DELETE in forms
const passport = require("passport"); // Import Passport authentication middleware
const LocalStrategy = require("passport-local"); // Import Passport strategy for authenticating with a username and password.
const User = require("./models/user"); // Import the User model
const mongoSanitize = require('express-mongo-sanitize'); // To prevent mongo injection


// Route files
const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

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
app.engine("ejs", engine); // Use ejs-mate as the rendering engine for EJS templates
app.set("view engine", "ejs"); // Set EJS as the templating engine
app.set("views", path.join(__dirname, "views")); // Define the folder where the views are located

app.use(express.urlencoded({ extended: true })); // Use middleware to parse URL-encoded data (like form submissions)
app.use(methodOverride("_method")); // Use method-override to interpret the "_method" query parameter as the actual HTTP method
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the 'public' directory
// npm i bootstrap@5.3.6 (latest version 11/06/25)
// Serve Bootstrap's CSS and JS files from node_modules at the /bootstrap URL path
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);
app.use(mongoSanitize())

// Express-session middleware
const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week in miliseconds
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig)); // This shoud be used BEFORE using passport.session()

app.use(flash()); // We’re using the connect-flash package to add flash message support.

// Passport configuration
app.use(passport.initialize()); // Initializes Passport for authentication handling
app.use(passport.session()); // Enables persistent login sessions (uses cookies + serialization)
// Sets up Passport to use the local strategy with User's authentication method (provided by passport-local-mongoose)
passport.use(new LocalStrategy(User.authenticate()));
// Defines how user data is stored in the session (typically stores user ID)
passport.serializeUser(User.serializeUser());
// Defines how user data is retrieved from the session (fetches full user object from the ID)
passport.deserializeUser(User.deserializeUser());

//This middleware is used to make certain variables available in all views (templates) of the app
app.use((req, res, next) => {
  //console.log(req.session);
  res.locals.currentUser = req.user; // Makes the currently authenticated user (from Passport) available in all templates as currentUser.
  res.locals.success = req.flash("success"); // Retrieves any "success" flash messages and makes them available in views as success.
  res.locals.error = req.flash("error"); // Same as above, but for "error" messages.
  next();
});

// Route handlers middleware
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  // Main route, home view
  res.render("./home");
});

app.all(/(.*)/, (req, res, next) => {
  // Catch-all route for any non-matching paths
  // Creates a 404 error and passes it to the error handler
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  // Global error handler middleware
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("./error", { err });
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
