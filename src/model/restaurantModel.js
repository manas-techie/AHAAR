const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantModel = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: "https://icons.iconarchive.com/icons/aha-soft/large-home/256/Property-icon.png",
        set: (v) => v === "" ? "https://icons.iconarchive.com/icons/aha-soft/large-home/256/Property-icon.png " : v,

    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

const Restaurant = mongoose.model("Restaurant", restaurantModel);
module.exports = Restaurant;