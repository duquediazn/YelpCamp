const Joi = require("joi"); // Import Joi for schema validation

// Define a Joi validation schema for a campground object
module.exports.campgroundSchema = Joi.object({ // https://joi.dev/api/?v=17.13.3
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        //image: Joi.string().required(), //¿Añadir aquí el límite de archivos y de MB que poder subir? 
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required(), // We need to also required the entire key campground
    deleteImages: Joi.array()
});

// Define a Joi validation schema for a review object
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})
