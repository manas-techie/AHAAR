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
            res.redirect("/restaurant");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/user/signup");
    }
}));

router.get('/login', saveRedirectUrl, (req, res) => {
    res.render('user/login');
});

router.post('/login', saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/user/login", failureFlash: true }), wrapAsync(async (req, res) => {
    req.flash("success", "Welcome back");
    console.log(res.locals.redirectUrl)
    res.redirect(res.locals.redirectUrl || "/restaurant");
}));

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have logged out");
        res.redirect("/restaurant");
    });
});



module.exports = router;