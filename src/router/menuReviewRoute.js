const express = require('express');
const { isLoggesIn, saveRedirectUrl } = require('../middlewares/userMiddleware');
const Menu = require('../model/menuModel');
const menuReview = require("../model/menuReviewModel")
const router = express.Router({ mergeParams: true });

router.post('/:id/menureview', isLoggesIn, async (req, res) => {
    let { id } = req.params;
    let menu = await Menu.findOne({owner: id});
    if (!menu) {
        req.flash("error", "Menu not found");
        return res.redirect("/menu");
    }
    let newReview = new menuReview(req.body.review);
    newReview.author = req.user._id;
    menu.reviews.push(newReview);
    await menu.save();
    await newReview.save();
    req.flash("success", "Successfully added a new review");
    res.redirect(`/menu/${id}`);
});

router.delete('/:id/:reviewId', async (req, res) => {
    let { id, reviewId } = req.params;
    let menu = await Menu.findById(id).populate({path : "owner"});
    await Menu.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await menuReview.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/menu/${menu.owner._id}`);

});


module.exports = router;