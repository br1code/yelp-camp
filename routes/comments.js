const express           = require("express"),
    Campground          = require("../models/campground"),
    Comment             = require("../models/comment"),
    middleware          = require("../extras/middleware");

// Preserve the req.params values from the parent router
const router = express.Router({mergeParams: true});


// NEW - Show form to create new comment
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE - Add new comment to the DB
router.post("/", middleware.isLoggedIn, (req, res) => {
    // Find the campground to add the comment
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(`Error: ${err}`);
            res.redirect("/campgrounds");
        } else {
            // Create the new comment and save to the DB
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(`Error: ${err}`);
                } else {
                    // Add new comment to the campground and save
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

module.exports = router;