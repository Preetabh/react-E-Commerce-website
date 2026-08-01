const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, default: "" },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },

    // UI Customization fields
    bgcolor: { type: String, default: "#ffffff" },
    panelcolor: { type: String, default: "#f0f0f0" },
    textcolor: { type: String, default: "#000000" },

    details: { type: String },
    information: { type: String },

    keyFeatures: [{ type: String }],
    warranty: { type: String, default: "1 Year Standard Warranty" },
    stock: { type: Number, default: 50 },
    sku: { type: String, default: "" },
    tags: [{ type: String }],
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },

    category: { type: String, required: true },
    rating: { type: Number, default: 4.8 },

    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
