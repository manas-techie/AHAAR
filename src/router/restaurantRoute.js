const express = require('express');
const router = express.Router();
const Restaurant = require('../model/restaurantModel.js');
const ExpressError = require('../utils/expressError.js');
const { isLoggesIn } = require('../middlewares/userMiddleware.js');



// restaurant route
router.get('/', async (req, res) => {
    const allRestaurants = await Restaurant.find({});
    res.render('restaurant/index.ejs', { allRestaurants });
});

//create new restaurant route
router.post('/', async (req, res) => {
    const newRestaurant = new Restaurant(req.body.restaurant);
    newRestaurant.owner = req.user._id;
    await newRestaurant.save();
    req.flash("success", "New restaurant added");
    res.redirect("/restaurant");
});


// new restaurant route
router.get('/new', isLoggesIn, (req, res) => {
    res.render('restaurant/new.ejs');
});


// show restaurant route
router.get('/:id', async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!restaurant) {
        req.flash('error', 'this restaurant does not exists');
        return res.redirect('/restaurant');
    }
    console.log(req.user);
    res.render('restaurant/show.ejs', { restaurant });
});

//edit restaurant rount
router.get('/:id/edit', isLoggesIn, async (req, res) => {
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
        // throw new ExpressError(404, "Page not Found!");
        res.status(404).send("Page not Found!");
    }
    res.render("restaurant/edit.ejs", { restaurant });
});


// update route
router.put('/:id', isLoggesIn, async (req, res) => {
    let { id } = req.params;
    let restaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant });
    await restaurant.save();
    req.flash('success', 'Details updated');
    res.redirect(`/restaurant/${id}`);
});

//Destroy route
router.delete('/:id', isLoggesIn, async (req, res) => {
    let { id } = req.params;
    let restaurant = await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'restaurant deleted');
    res.redirect("/restaurant");
});

module.exports = router;