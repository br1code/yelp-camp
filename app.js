const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 3000;


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/yelp_camp");

// SCHEMA SETUP ---------------------------------------------------

var campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundsSchema);


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
            res.render("index", {campgrounds: campgrounds});
        }
    });
});

// CREATE - add new campground to DB
app.post("/campgrounds", (req, res) => {
    let newCampground = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
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
    res.render("new");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            res.render("show", {campground: campground});
        }
    });
});


// LISTEN ---------------------------------------------------------
app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});