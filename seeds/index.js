const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const randomPrice = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '689f8e0db5932856474f4b20', // Mongo needs to have at lest one user already in the DB, paste that user's ID here
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dy2nzk6fq/image/upload/v1755286455/YelpCamp/cbe5ryjkycijylbmyciu.jpg',
          filename: 'YelpCamp/cbe5ryjkycijylbmyciu'
        },
        {
          url: 'https://res.cloudinary.com/dy2nzk6fq/image/upload/v1755286475/YelpCamp/jvnotse9dl8t3dcpin8e.jpg',
          filename: 'YelpCamp/jvnotse9dl8t3dcpin8e'
        }
      ],
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis aspernatur, inventore error deleniti quam, eum enim odit voluptates fuga repudiandae similique esse quo? Itaque architecto, nihil vero perferendis possimus quasi?",
      price: randomPrice
    });
    await camp.save();
  }
};

seedDB();
