const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
    {
        name: "Cloud's Rest",
        image: "https://cdn.houseplans.com/product/o2d2ui14afb1sov3cnslpummre/w1024.jpg?v=15",
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu."
    },
    {
        name: "Simple Camping",
        image: "http://soaringeaglecampground.com/test/wp-content/uploads/2014/01/view-of-the-basket-at-Soaring-Eagle.jpg",
        description: "Lorem ipsum dolor sit amet, at eos sint debitis minimum, harum aliquid mea ea. Est ei ullum petentium, fabellas incorrupte honestatis pro ei. Deserunt iudicabit tincidunt vis an. Mei id augue doctus. Doctus deserunt id cum. Veri temporibus necessitatibus ex mel. Iriure facilis ne usu, ipsum vulputate delicatissimi vel id, euismod delenit probatus no duo."
    },
    {
        name: "Rocking Campground",
        image: "https://www.outdoorproject.com/sites/default/files/styles/cboxshow/public/1428892506/aron_bosworth-2-4.jpg?itok=WGx0ofoi",
        description: "Eu unum delenit vim. Vel ex saperet aliquando referrentur, cu regione salutatus liberavisse pro. At vim exerci inimicus, mel ne justo referrentur. Id sanctus liberavisse eum, hinc solum delicatissimi at est. Per novum dolorem habemus ne, causae vituperata contentiones ius ea. Id quo appareat comprehensam, solum illum facer cu duo, et feugiat aliquando adolescens his."
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