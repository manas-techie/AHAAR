const express = require('express');
const router = express.Router();
const User = require('../model/userRestrationModel')
router.get('/', (req, res) => {
    res.send("hi i am root")
})

router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router;