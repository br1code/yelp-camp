const mongoose = require("mongoose");

let commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

let commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;