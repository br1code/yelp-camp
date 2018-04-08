const express           = require("express"),
    moment              = require("moment"),
    Campground          = require("../models/campground"),
    Comment             = require("../models/comment"),
    middleware          = require("../extras/middleware");

// Preserve the req.params values from the parent router
const router = express.Router({mergeParams: true});


// NEW - Show form to create new comment
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err || !campground) {
            console.log(`Error: ${err}`);
            req.flash("error", "Unable to add comment - Campground not found");
            res.redirect("/campgrounds");
        } else {
            res.render("comments/new", {campground});
        }
    });
});

// CREATE - Add new comment to the DB
router.post("/", middleware.isLoggedIn, (req, res) => {
    // Find the campground to add the comment
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(`Error: ${err}`);
            req.flash("error", "Unable to create new comment");
            res.redirect("back");
        } else {
            // Create the new comment and save to the DB
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(`Error: ${err}`);
                    req.flash("error", "Unable to create new comment");
                    res.redirect("back");
                } else {
                    // add id and username to comment using req.user
                    // from the custom middleware
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.date = moment().calendar();
                    comment.save();
                    // Add new comment to the campground and save
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added successfully");
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});


router.get("/:comment_id/edit", middleware.checkCampAuthor, 
    middleware.checkCommentAuthor, (req, res) => {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                console.log(`Error: ${err}`);
                req.flash("error", "Unable to edit comment - Comment not found");
                res.redirect("back");
            } else {
                res.render("comments/edit", {
                    comment,
                    campground_id: req.params.id
                });
            }
        });
});

// UPDATE - Update a comment
router.put("/:comment_id", middleware.checkCampAuthor, 
    middleware.checkCommentAuthor, (req, res) => {
        // update time first
        req.body.comment.date = moment().calendar();
        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, 
        (err, comment) => {
            if (err || !comment) {
                console.log(`Error: ${err}`);
                req.flash("error", "Unable to edit comment - Comment not found");
                res.redirect("back");
            } else {
                req.flash("success", "Comment updated successfully");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
});


// DESTROY - Delete a comment
router.delete("/:comment_id", middleware.checkCommentAuthor, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, err => {
        if (err) {
            console.log(`Error: ${err}`);
            req.flash("error", "Unable to delete comment - Comment not found");
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;