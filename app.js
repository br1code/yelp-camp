const express               = require("express"),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    seedDB                  = require("./seeds"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    expressSession          = require("express-session"),
    User                    = require("./models/user");

const indexRoutes           = require("./routes/index"),
    commentRoutes           = require("./routes/comments"),
    campgroundRoutes        = require("./routes/campgrounds");
    

const app = express();

const port = process.env.PORT || 3000;

// CONFIG ---------------------------------------------------------

// Mongoose configuration
mongoose.connect("mongodb://localhost/yelp_camp");

// Express configuration
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));


// Passport configuration
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

// Middleware to provide currentUser to all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// Routes using prefixs
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// Fill the DB with initial data
seedDB();

// LISTEN ---------------------------------------------------------
app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});