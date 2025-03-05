const Restaurant = require("../model/restaurantModel.js");


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; //store the url they are requesting   
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let restaurant = await Restaurant.findById(id);
    if (!restaurant.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/stayease/${id}`);
    }
    next();
};