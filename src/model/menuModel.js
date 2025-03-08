const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: "Item"
        }
    ]
});

// Item Schema (e.g., "Cheeseburger", "Pepsi", "Spaghetti")
const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    }
});

// Menu Schema (Linked to a User)
const menuSchema = new Schema({
    menuOwner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: "Category"
        }
    ]
});

// Define Models
const Category = mongoose.model("Category", categorySchema);
const Item = mongoose.model("Item", itemSchema);
const Menu = mongoose.model("Menu", menuSchema);

// Export Models
module.exports = { Category, Item, Menu };