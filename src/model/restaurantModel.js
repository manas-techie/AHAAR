const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantModel = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "https://icons.iconarchive.com/icons/aha-soft/large-home/256/Property-icon.png",
        set: (v) => v === "" ? "https://icons.iconarchive.com/icons/aha-soft/large-home/256/Property-icon.png " : v,

    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },

});

const Restaurant = mongoose.model("Restaurant", restaurantModel);
module.exports = Restaurant;