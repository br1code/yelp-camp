// Check if user is logged in
let isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = {
    isLoggedIn: isLoggedIn
};