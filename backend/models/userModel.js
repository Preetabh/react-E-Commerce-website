const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

    otp: {
        type: String
    },
     otpExpiry: { type: Date },

    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    orders: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        quantity: Number,
        price: Number,
        status: { type: String, default: "pending" },
        orderDate: { type: Date, default: Date.now }
    }],
    password: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
    },
    profilePicture: {
        data: Buffer, // Binary data for the image
        contentType: String, // MIME type (e.g., 'image/png', 'image/jpeg')
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String
    },
    coins: {
        type: Number,
        default: 250,
    }
});


const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
