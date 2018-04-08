const express           = require("express"),
    passport            = require("passport"),
    User                = require("../models/user");

const router = express.Router();


// Root -----------------------------------------------------------
router.get("/", (req, res) => {
    res.render("landing");
});


// Sign Up --------------------------------------------------------
router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/signup", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(`Error: ${err}`);
            req.flash("error", err.message);
            return res.redirect("/signup");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", `Welcome to YelpCamp ${user.username}`);
            res.redirect("/campgrounds");
        });
    });
}); 

// Log In ---------------------------------------------------------
router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    console.log("User logged in");
});

// Log Out --------------------------------------------------------
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You have successfully logged out");
    res.redirect("/campgrounds");
});

module.exports = router;