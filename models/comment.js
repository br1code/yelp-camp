const mongoose = require("mongoose");

let commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    date: String
});

let commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;