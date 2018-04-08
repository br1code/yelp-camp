const mongoose      = require("mongoose"),
    flash           = require("connect-flash"),
    Campground      = require("../models/campground"),
    Comment         = require("../models/comment");

// Check if user is logged in
let isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

// Check if the current user is the author of the campground
let checkCampAuthor = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

// Check is the current user is the author of the comment
let checkCommentAuthor = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

// Provide currentUser to the route
let currentUser = (req, res, next) => {
    res.locals.currentUser = req.user;
    next();
};

// Provide flash messages to the route
let flashMessages = (req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
};

module.exports = {
    isLoggedIn,
    checkCampAuthor,
    checkCommentAuthor,
    currentUser,
    flashMessages
};