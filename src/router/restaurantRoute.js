const express = require('express');
const router = express.Router();
const Restaurant = require('../model/restaurantModel.js');


// restaurant route
router.get('/', async (req, res) => {
    const allRestaurants = await Restaurant.find({});
    res.render('restaurant/index.ejs', { allRestaurants });
});

//create new restaurant route
router.post('/', async (req, res) => {
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

// update route
router.put('/:id', async (req, res) => {
    let { id } = req.params;
    let restaurant = await Restaurant.findByIdAndUpdate(id);
    await restaurant.save();
    req.redirect(`/retaurant/${id}`);
})

//Destroy route
router.delete('/:id', async (req, res) => {
    let { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.redirect("/restraurant");
})


module.exports = router;