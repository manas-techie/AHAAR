const express = require('express');
const router = express.Router();
const Restaurant = require('../model/restaurantModel.js');


// restaurant route
router.get('/', async (req, res) => {
    const allRestaurants = await Restaurant.find({});
    res.render('restaurant/index.ejs', { allRestaurants });
});

router.post('/', async(req, res) => {
    const newRestaurant = new Restaurant(req.body.restaurant);
    await newRestaurant.save();
    res.redirect("/restaurant");
});


// new restaurant route
router.get('/new', (req, res) => {
    res.render('restaurant/new.ejs');
});


// show restaurant route
router.get('/:id', async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    res.render('restaurant/show.ejs', { restaurant });
});

module.exports = router;