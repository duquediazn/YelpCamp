const BaseJoi = require("joi"); // Import Joi for schema validation
const sanitizeHtml = require("sanitize-html"); //For HTML sanitization
/*
Instead of using Joi we could be using express-validator, which already comes with Cross-Site Scripting (XSS) sanitization. 
https://express-validator.github.io/docs/

But because we're using Joi, we need to define our own extension to sanitize our user input strings.
*/
const extension = (joi) => ({ // Note the implicit return, we are returning and object!
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: { // We create this new rule
            validate(value, helpers) { // The rules that we define need to have this validate function
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}, //We're not allowing any exceptions
                });
                // If the sanitized version differs from the input, return an error
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
})

const Joi = BaseJoi.extend(extension)

// Define a Joi validation schema for a campground object
module.exports.campgroundSchema = Joi.object({ // https://joi.dev/api/?v=17.13.3
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        //image: Joi.string().required(), //¿Añadir aquí el límite de archivos y de MB que poder subir? 
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required(),
    }).required(), // We need to also required the entire key campground
    deleteImages: Joi.array()
});

// Define a Joi validation schema for a review object
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})
