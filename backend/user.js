const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,

    // 👇 idi add chey
    courses: [
        {
            name: String,
            level: Number
        }
    ]
});

module.exports = mongoose.model("User", UserSchema);

