const express = require('express');
const router = express.Router();
const User = require('../model/userRestrationModel')
router.get('/', (req, res) => {
    res.render('home');
})

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/chooselogin', (req, res) => {
    res.render('user/ChooseLogin')
});

module.exports = router;