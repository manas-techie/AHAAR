const express = require('express');
const Restaurant = require('../model/restaurantModel');
const Review = require('../model/reviewModel');
const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
    let { id } = req.params;
    let restaurant = await Restaurant.findById(id);
    let newReview = new Review(req.body.review);
    // newReview.author = req.user._id;
    restaurant.reviews.push(newReview);
    await restaurant.save();
    await newReview.save();
    req.flash("success", "Successfully added a new review");
    res.redirect(`/restaurant/${id}`);
});


router.delete('/:reviewId', async (req, res) => {
    let { id, reviewId } = req.params;
    await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/restaurant/${id}`);
});


module.exports = router;