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
        } else {
            res.render("campgrounds/index", {
                campgrounds: campgrounds,
            });
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
        } else {
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
            } else {
                res.render("campgrounds/show", {
                    campground: campground
                });
            }
        });
});

module.exports = router;