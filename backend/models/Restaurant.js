const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    cuisine: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, default: "" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
