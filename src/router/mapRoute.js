require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

const MAPBOX_TOKEN = process.env.MY_MAPBOX_TOKEN; // Replace with your real token

// Render the main map page
router.get('/map', (req, res) => {
    res.render('map', { mapboxToken: MAPBOX_TOKEN });
});

// API endpoint to get nearby restaurants
router.get('/nearby-restaurants', async (req, res) => {
    const { lng, lat } = req.query;

    try {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/restaurant.json`, {
            params: {
                proximity: `${lng},${lat}`,
                access_token: MAPBOX_TOKEN,
                types: 'poi',
                limit: 10
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch nearby restaurants' });
    }
});

module.exports = router;
