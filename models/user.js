const mongoose = require("mongoose");
// Import passport-local-mongoose plugin to easily add username/password authentication
const passportLocalMongoose = require("passport-local-mongoose"); // https://github.com/saintedlama/passport-local-mongoose
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  // We only define email, the rest will be handled by passport-local-mongoose
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// Plug in passport-local-mongoose to add:
// - username and hashed password fields (e.g. username, hash, salt)
// - helper methods like register(), authenticate(), etc.
// - automatic password hashing and salting
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
