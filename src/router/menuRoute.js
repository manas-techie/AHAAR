const express = require('express');
const mongoose = require("mongoose")
const router = express.Router();
const Menu = require("../model/menuModel.js");
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggesIn, saveRedirectUrl } = require('../middlewares/userMiddleware.js');
const QRCode = require("qrcode")


// This is the code for displaying create menu form
router.get("/", isLoggesIn, saveRedirectUrl, async (req, res) => {
    res.render("menu/menuForm.ejs");
});

// POST Route to create a menu
router.post('/:currUserId', async (req, res) => {
    try {
        const { categories } = req.body;
        let { currUserId } = req.params;
        const ownerId = currUserId; // Assuming user authentication middleware is used

        const formattedCategories = categories.map(category => {
            const categoryName = category.customName && category.customName.trim() !== ""
                ? category.customName
                : category.name; // Use custom name if provided, else use selected category

            return {
                name: categoryName,
                items: category.items ? category.items.map(item => ({
                    name: item.name,
                    description: item.description || "",
                    price: parseFloat(item.price),
                    imageUrl: item.imageUrl || "",
                    available: item.available === "on" // Checkbox returns "on" when checked
                })) : []
            };
        });

        const newMenu = new Menu({
            owner: new mongoose.Types.ObjectId(ownerId),
            categories: formattedCategories
        });

        await newMenu.save();
        res.redirect(`/menu/${currUserId}`); // Redirect to success page or menu listing
    } catch (error) {
        console.error("Error saving menu:", error);
        res.status(500).send("Error saving menu data.");
    }
});


// GET route to display menu
router.get('/:currUserId', async (req, res) => {
    let { currUserId } = req.params;
    try {
        const menu = await Menu.findOne({ owner: currUserId }).populate({path:"reviews", populate:{path:"author"} });
        if (!menu) {
            return res.status(404).send("Menu not found");
        }
        res.render('menu/showMenu.ejs', { menu, currUserId });
    } catch (error) {
        console.error("Error fetching menu:", error);
        res.status(500).send("Error fetching menu");
    }
});

// edit route
router.get('/:currUserId/edit', async (req, res) => {
    let { currUserId } = req.params;
    try {
        const menu = await Menu.findOne({ owner: currUserId });
        if (!menu) {
            return res.status(404).send("Menu not found");
        }
        res.render('menu/editMenu.ejs', { menu, currUserId });
    } catch (error) {
        console.error("Error fetching menu for editing:", error);
        res.status(500).send("Error loading edit menu page.");
    }
});

//Update route
router.post('/:currUserId/edit', async (req, res) => {
    let { currUserId } = req.params;
    try {
        const { categories } = req.body;
        let menu = await Menu.findOne({ owner: currUserId });
        if (!menu) {
            return res.status(404).send("Menu not found");
        }

        // Convert categories and items from form data
        const updatedCategories = categories.map(category => {
            return {
                name: category.name,
                items: category.items ? category.items.map(item => ({
                    _id: item.id || new mongoose.Types.ObjectId(),
                    name: item.name,
                    description: item.description || "",
                    price: parseFloat(item.price),
                    imageUrl: item.imageUrl || "",
                    available: item.available === "on"
                })) : []
            };
        });

        // Update menu with new categories and items
        menu.categories = updatedCategories;
        await menu.save();

        res.redirect(`/menu/${currUserId}`);
    } catch (error) {
        console.error("Error updating menu:", error);
        res.status(500).send("Error updating menu.");
    }
});

// QR code generate route
router.get("/:currUserId/qrcode", (req, res) => {
    let { currUserId } = req.params;
    // const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let fullUrl = `https://ahaar-6ycm.onrender.com/menu/${currUserId}`;

    QRCode.toDataURL(fullUrl, function (err, qrUrl) {
        if (err) {
            res.status(500).send("Internal server error");
        }
        res.render('menu/menuQR.ejs', { qrUrl });
    })

});

//Chatbot route
router.get('/:currUserId/chatbot', async (req, res) => {
    let { currUserId } = req.params;
    try {
        const menu = await Menu.findOne({ owner: currUserId }).populate({path:"reviews", populate:{path:"author"} });
        req.app.locals.menuId = menu._id;
        if (!menu) {
            return res.status(404).send("Menu not found");
        }
        res.render('chatbot/chatbot.ejs', { menu, currUserId });
    } catch (error) {
        console.error("Error fetching menu for chatbot:", error);
        res.status(500).send("Error loading chatbot page.");
    }
});



module.exports = router;