const mongoose = require("mongoose");

let campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

let campgroundModel = mongoose.model("Campground", campgroundsSchema);

module.exports = campgroundModel;