const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviewModel');

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

restaurantModel.post('findOneAndDelete', async function (restaurant) {
    if (restaurant) {
        await Review.deleteMany({ _id: { $in: restaurant.reviews } });
    }
});

const Restaurant = mongoose.model("Restaurant", restaurantModel);
module.exports = Restaurant;