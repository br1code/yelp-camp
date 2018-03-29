const mongoose = require("mongoose");

let campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

let campgroundModel = mongoose.model("Campground", campgroundsSchema);

module.exports = campgroundModel;