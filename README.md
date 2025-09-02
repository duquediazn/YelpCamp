# YelpCamp

Code along final project for the bootcamp [Web Developer Bootcamp by Colt Steele - Udemy](https://www.udemy.com/course/the-web-developer-bootcamp).

## What is YelpCamp?

YelpCamp is a project developed as part of Colt Steele's Web Developer Bootcamp course on Udemy.  
It is a website where users can create and review campgrounds. Authentication is required to add or review campgrounds.

## Main technologies used in this project

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-20232A?style=flat&logo=ejs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)
![Passport](https://img.shields.io/badge/Passport.js-34E27A?logo=passport&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white)

## Getting started

1. **Clone the repository**
   ```bash
   git clone https://github.com/duquediazn/YelpCamp.git
   cd YelpCamp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file in the root directory with the following keys:
   ```bash
    # Mongo Atlas credentials
    DB_USER=your_mongo_username
    DB_PASS=your_mongo_password
    DB_URL=mongodb+srv://your_mongo_username:your_mongo_password@cluster0.xxxxx.mongodb.net/yelp-camp
    
    # Cloudinary config
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_KEY=your_cloud_key
    CLOUDINARY_SECRET=your_cloud_secret
    
    # Maptiler API
    MAPTILER_API_KEY=your_maptiler_api_key
    
    # Session secret
    SECRET=your_session_secret
   ```

4. **Start the server**
   ```bash
   node app.js
   # or (optional, if you prefer auto-reload and have nodemon installed)
   nodemon app.js
   ```

   The app will be running at [http://localhost:3000](http://localhost:3000).

## Database setup

- **Local MongoDB**: the app defaults to `mongodb://localhost:27017/yelp-camp`.  
- **Mongo Atlas**: create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), copy the connection string, and replace `DB_URL` in your `.env`.

## Deployment (Render)

To deploy on [Render](https://render.com/):
- Add your repo as a new web service.
- Configure environment variables in the Render dashboard (same as your `.env`).
- Use `npm install` as build command and `node app.js` as start command.

---

This project also uses:
- **Helmet** and **express-mongo-sanitize** for security.
- **Multer** + **Cloudinary** for image upload & storage.
- **Passport.js** for authentication.
- **Joi** + **sanitize-html** for input validation.

---

**Disclaimer**: This project is for educational purposes only, built as part of a code along exercise from Colt Steele's Web Developer Bootcamp.  
