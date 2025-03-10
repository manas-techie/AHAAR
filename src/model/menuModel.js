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
          imageUrl: { type: String },
          available: { type: Boolean, default: true }
        }
      ]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
