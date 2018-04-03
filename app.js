const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds");

const app = express();

const port = process.env.PORT || 3000;


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/yelp_camp");


seedDB();

// ROUTES ---------------------------------------------------------

app.get("/", (req, res) => {
    res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
    // get all campgrounds from DB
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

// CREATE - add new campground to DB
app.post("/campgrounds", (req, res) => {
    let newCampground = {
        name: req.body.campground.name,
        image: req.body.campground.image,
        description: req.body.campground.description
    };
    // create the new campground and save to the DB
    Campground.create(newCampground, (err, campground) => {
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// NEW - show form to create new campground
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).
        populate("comments").
        exec((err, campground) => {
            if (err) {
                console.log(`Error: ${err}`);
            } else {
                res.render("campgrounds/show", {campground: campground});
            }
        });
});

// COMMENTS ROUTES ------------------------------------------------

// NEW - show form to create new comment
app.get("/campgrounds/:id/comments/new", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE - add new comment to the db
app.post("/campgrounds/:id/comments", (req, res) => {
    // Find the campground to add the comment
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(`Error: ${err}`);
            res.redirect("/campgrounds");
        } else {
            // create the new comment and save to the DB
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(`Error: ${err}`);
                } else {
                    // add new comment to the campground and save
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});
// LISTEN ---------------------------------------------------------
app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});