const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
    {
        name: "Cloud's Rest",
        image: "https://cdn.houseplans.com/product/o2d2ui14afb1sov3cnslpummre/w1024.jpg?v=15",
        description: "bla bla bla"
    },
    {
        name: "Simple Camping",
        image: "http://soaringeaglecampground.com/test/wp-content/uploads/2014/01/view-of-the-basket-at-Soaring-Eagle.jpg",
        description: "Come to my place!!"
    },
    {
        name: "Rocking Campground",
        image: "https://www.outdoorproject.com/sites/default/files/styles/cboxshow/public/1428892506/aron_bosworth-2-4.jpg?itok=WGx0ofoi",
        description: "Rocky Rock"
    }
];

function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, err => {
        if (err) {
            console.log(err);
        } else {
            console.log("removed campgrounds!");
            addSomeCampgrounds();
        }
    });
}

// Add a few campgrounds
function addSomeCampgrounds() {
    data.forEach(seed => {
        Campground.create(seed, (err, campground) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Added a campground");
                addSomeComment(campground);
            }
        });
    });
}

function addSomeComment(campground) {
    Comment.create({
        text: "This place is great, but I wish there was internet",
        author: "Br1"
    }, (err, comment) => {
        if (err) {
            console.log(err);
        } else {
            campground.comments.push(comment);
            campground.save();
            console.log("Created a new comment");
        }
    });
}

module.exports = seedDB;