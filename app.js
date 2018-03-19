const express = require("express");
const bodyParser = require("body-parser");
var app = express();

const port = process.env.PORT || 3000;


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var campgrounds = [
    {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/11/29/04/17/bonfire-1867275__340.jpg"},
    {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2018/01/22/17/32/nature-3099457__340.jpg"},
    {name: "Mountain Goat", image: "https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242__340.jpg"},
    {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2017/05/05/16/06/teepees-2287571__340.jpg"},
    {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2017/08/06/18/33/barn-2594975__340.jpg"},
    {name: "Mountain Goat", image: "https://cdn.pixabay.com/photo/2017/04/10/14/08/freedom-2218616__340.jpg"},
    {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2017/08/07/15/35/travel-2604981__340.jpg"},
    {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2017/07/31/21/55/people-2561455__340.jpg"},
    {name: "Mountain Goat", image: "https://cdn.pixabay.com/photo/2017/04/05/01/11/bridge-2203661__340.jpg"},
    {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2017/08/07/15/44/people-2605056__340.jpg"},
    {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2017/10/07/01/01/bach-leek-2825197__340.jpg"},
    {name: "Mountain Goat", image: "https://cdn.pixabay.com/photo/2018/02/02/13/37/nature-3125452__340.jpg"}
];

// ROUTES
app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    
    res.render("campgrounds", {
        campgrounds: campgrounds
    });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.post("/campgrounds", (req, res) => {
    let newCampground = {name: req.body.name, image: req.body.image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

// LISTEN
app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});