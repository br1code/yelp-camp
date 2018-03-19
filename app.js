var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

var app = express();
mongoose.connect("mongodb://localhost/yelp_camp");

const port = process.env.PORT || 3000;


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


// SCHEMA SETUP

var campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundsSchema);

// Campground.create({
//     name: "Salmon Creek",
//     image: "https://cdn.pixabay.com/photo/2016/11/29/04/17/bonfire-1867275__340.jpg"
// }, (err, campground) => {
//     if (err) {
//         console.log(`Error: ${err}`);
//     } else {
//         console.log("We just save a campground to the DB");
//         console.log(campground);
//     }
// });



// ROUTES
app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    // get all campgrounds from DB
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            res.render("campgrounds", {campgrounds: campgrounds});
        }
    });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.post("/campgrounds", (req, res) => {
    let newCampground = {name: req.body.name, image: req.body.image};
    Campground.create(newCampground, (err, campground) => {
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// LISTEN
app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});