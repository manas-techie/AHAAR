const Restaurant = require("../model/restaurantModel.js");

module.exports.isLoggesIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you have to logged in first!");
        return res.redirect('/chooselogin');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; //store the url they are requesting   
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {kkkkkkkkkkkkkkkkkkkkkk
    let { id } = req.params;
    let restaurant = await Restaurant.findById(id);
    if (!restaurant.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/restaurant/${id}`);
    }
    next();
};

