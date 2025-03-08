const express = require('express');
const router = express.Router();
const { Category, Item, Menu } = require("../model/menuModel.js");
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggesIn, saveRedirectUrl } = require('../middlewares/userMiddleware.js');


// This is the code for displaying create menu form
router.get("/", isLoggesIn, saveRedirectUrl, async (req, res) => {
    const categories = await Category.find({});
    res.render("menu/menuForm.ejs", { categories });
});


// This is the code for displaying the menu
router.get("/:currUserId", async (req, res) => {

})


// This is the code for handle the create menu form
router.post("/:currUserId", wrapAsync(async (req, res) => {
    let { currUserId } = req.params;
    const { category, newCategory, itemName, itemPrice } = req.body;

    let categoryId = category;

    // Create a new category if provided
    if (newCategory) {
        const newCat = new Category({ name: newCategory });
        await newCat.save();
        categoryId = newCat._id;
    }

    // Ensure itemName and itemPrice are treated as arrays
    const itemNames = Array.isArray(itemName) ? itemName : [itemName];
    const itemPrices = Array.isArray(itemPrice) ? itemPrice : [itemPrice];

    // Store item IDs for updating the category
    const itemIds = [];

    // Save multiple items with prices
    for (let i = 0; i < itemNames.length; i++) {
        const newItem = new Item({
            name: itemNames[i],
            itemPrice: parseFloat(itemPrices[i]), // Convert to number
            category: categoryId
        });

        await newItem.save();
        itemIds.push(newItem._id);
    }

    // Update category with new item IDs
    await Category.findByIdAndUpdate(categoryId, { $push: { items: { $each: itemIds } } });

    // Check if a menu exists for the current user
    let menu = await Menu.findOne({ menuOwner: currUserId });

    if (!menu) {
        // If no menu exists, create a new one and link the category
        menu = new Menu({
            menuOwner: currUserId,
            categories: [categoryId] // Add the first category
        });
    } else {
        // If the menu exists, update it with the new category (only if it's not already included)
        if (!menu.categories.includes(categoryId)) {
            menu.categories.push(categoryId);
        }
    }

    // Save or update the menu
    await menu.save();

    res.redirect("/menu"); // Redirect to menu page
}));


module.exports = router; 