const express           = require("express"),
    Campground          = require("../models/campground"),
    middleware          = require("../extras/middleware");

const router = express.Router();

// INDEX - Show all campgrounds
router.get("/", (req, res) => {
    // get all campgrounds from DB
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(`Error: ${err}`);
            req.flash("error", "Unable to show campgrounds");
            res.redirect("back");
        } else {
            res.render("campgrounds/index", {campgrounds});
        }
    });
});

// NEW - Show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// CREATE - Add new campground to DB
router.post("/", middleware.isLoggedIn,(req, res) => {
    let newCampground = {
        name: req.body.campground.name,
        image: req.body.campground.image,
        description: req.body.campground.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    // Create the new campground and save to the DB
    Campground.create(newCampground, (err, campground) => {
        if (err) {
            console.log(`Error: ${err}`);
            req.flash("error", "Unable to create new campground");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground created successfully");
            res.redirect("/campgrounds");
        }
    });
});

// SHOW - Shows more info about one campground
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).
        populate("comments").
        exec((err, campground) => {
            if (err) {
                console.log(`Error: ${err}`);
                req.flash("error", "Unable to show the campground - Campground not found");
                res.render("campgrounds/index");
            } else {
                res.render("campgrounds/show", {campground});
            }
        });
});

// EDIT - Show form to edit campground
router.get("/:id/edit", middleware.checkCampAuthor, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(`Error: ${err}`);
            req.flash("error", "Unable to edit the campground - Campground not found");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground});
        }
    })
});

// UPDATE - Update a campground
router.put("/:id", middleware.checkCampAuthor, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, 
        (err, campground) => {
            if (err) {
                console.log(`Error: ${err}`);
                req.flash("error", "Unable to edit the campground");
                res.redirect("/campgrounds");
            } else {
                req.flash("success", "Campground updated successfully");
                res.redirect("/campgrounds/" + req.params.id);
            }
    });
});

// DESTROY - Delete a campground
router.delete("/:id", middleware.checkCampAuthor, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, err => {
        if (err) {
            console.log(`Error: ${err}`);
            req.flash("error", "Unable to delete the campground");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted successfully");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;