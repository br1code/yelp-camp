const express               = require("express"),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    seedDB                  = require("./seeds"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    expressSession          = require("express-session"),
    Campground              = require("./models/campground"),
    Comment                 = require("./models/comment"),
    User                    = require("./models/user");

const app = express();

const port = process.env.PORT || 3000;

// CONFIG ---------------------------------------------------------

// mongoose configuration
mongoose.connect("mongodb://localhost/yelp_camp");

// express configuration
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));


// passport configuration
let sessionConfig = {
    secret: "the most encrypted secret in the world",
    resave: false,
    saveUninitialized: false
};

app.use(expressSession(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to provide currentUser to all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

seedDB();

// CUSTOM MIDDLEWARE ----------------------------------------------

// check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

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
            res.render("campgrounds/index", {
                campgrounds: campgrounds,
            });
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
                res.render("campgrounds/show", {
                    campground: campground
                });
            }
        });
});

// COMMENTS ROUTES ------------------------------------------------

// NEW - show form to create new comment
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE - add new comment to the db
app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
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

// AUTH ROUTES ------------------------------------------------

// signup
app.get("/signup", (req, res) => {
    res.render("users/signup");
});

app.post("/signup", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(`Error: ${err}`);
            return res.render("users/signup");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        });
    });
}); 

// login
app.get("/login", (req, res) => {
    res.render("users/login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
    console.log("User logged in");
});

// logout
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
})

// LISTEN ---------------------------------------------------------
app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});