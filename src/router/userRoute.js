const express = require('express');
const User = require('../model/userRestrationModel.js');
const router = express.Router();
const { saveRedirectUrl } = require("../middlewares/userMiddleware.js")
const passport = require('passport')
const wrapAsync = require("../utils/wrapAsync.js")



router.post('/signup', wrapAsync(async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({ email, username });
        let registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            };
            res.redirect("/");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/dealer/signup");
    }
}));




router.get('/login', saveRedirectUrl, (req, res) => {
    res.render('user/login');
});

router.post('/login', saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/dealer/login", failureFlash: true }), wrapAsync(async (req, res) => {
    req.flash("success", "Welcome back");
    res.redirect(res.locals.redirectUrl || "/");
}));

router.get('/signup', (req, res) => {
    res.render('user/signup');
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have logged out");
        res.redirect("/");
    });
});




module.exports = router;