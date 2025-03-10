const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [
    {
      name: { type: String, required: true },
      items: [
        {
          name: { type: String, required: true },
          description: { type: String },
          price: { type: Number, required: true },
          imageUrl: {
            type: String,
            default: "https://www.shutterstock.com/image-photo/fried-salmon-steak-cooked-green-600nw-2489026949.jpg",
            set: (v) => v === "" ? "https://www.shutterstock.com/image-photo/fried-salmon-steak-cooked-green-600nw-2489026949.jpg" : v,
          },
          available: { type: Boolean, default: true }
        }
      ]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
