const express = require('express');
const router = express.Router();
const User = require('../model/userRestrationModel')

router.get('/', (req, res) => {
    res.render('home');
})

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

//Choose Login route
router.get('/chooselogin', (req, res) => {
    res.render('user/ChooseLogin')
});

//Dashboard route
router.get('/dashboard', async (req, res) => {
    if (!req.user) {
        return res.redirect('/chooselogin');
    }
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.render('dashboard/dashboard', { user });
});

module.exports = router;