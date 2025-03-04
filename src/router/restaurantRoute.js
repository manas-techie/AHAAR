const express = require('express');
const router = express.Router();
const Restaurant = require('../model/restaurantModel.js');

router.get('/', async (req, res) => {
    const allRestaurants = await Restaurant.find({});
    res.render('restaurant/index.ejs', { allRestaurants });
});

router.get('/new', (req, res) => {
    res.render('restaurant/new.ejs');
});

router.get('/:id', async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    res.render('restaurant/show.ejs', { restaurant });
});

module.exports = router;