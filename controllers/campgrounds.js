const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground"); // Import the Campground model
const review = require("../models/review");
//MapTiler
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res, next) => {
    // List all campgrounds
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    // Form to create a new campground
    res.render("campgrounds/new");
}

module.exports.createCampground = async (req, res) => {
    // Create a new campground
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 }); //MapTiler geocoding
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry; // Store GeoJSON
    campground.author = req.user._id;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await campground.save();
    req.flash("success", "Successfully made a new campground!") // Flash msg
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
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

}

module.exports.renderEditForm = async (req, res) => {
    //Form to edit a specific campground
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
}

module.exports.updateCampground = async (req, res) => {
    //Edit a specific campground
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 }); //MapTiler geocoding
    campground.geometry = geoData.features[0].geometry; // Store GeoJSON
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filname of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filname);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    //Delete a specific campground
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground successfully deleted!")
    res.redirect("/campgrounds");
}