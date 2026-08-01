require("dotenv").config();
const OrderModel = require("../models/orderModel");
const Product = require("../models/productModel");
const OwnerModel = require("../models/ownerModel");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const orderController = {};

// 📌 Place Online Order
orderController.placeOrder = async (req, res) => {
  try {
    // 🔐 Token se user decode
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // 👤 User find by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { productId, amount } = req.body;
    console.log(
      `Placing order for User: ${email}, UserId: ${user._id}, Product: ${productId}, Amount: ${amount}`
    );

    if (!productId || !amount) {
      return res
        .status(400)
        .json({ message: "Product Id and Amount are required" });
    }

    // ✔ Validate Product Exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🆔 Generate transaction ID
    const transactionId =
      "TXN-" + Date.now() + "-" + Math.floor(Math.random() * 99999);

    // 📦 Create Order (IMPORTANT: userId pass karo)
    const newOrder = await OrderModel.create({
      userId: user._id,
      productId,
      amount,
      paymentStatus: "Success",
      transactionId,
      status: "Confirmed",
      paymentMethod: req.body.paymentMethod || "Online",
    });

    // 🪙 Update User Coins Balance (Earn 5% cashback + optionally redeem ALL coins)
    const userCoinsAvailable = user.coins ?? 250;
    let coinsRedeemed = 0;
    if (req.body.redeemCoins) {
      coinsRedeemed = req.body.redeemedAmount
        ? Math.min(userCoinsAvailable, Number(req.body.redeemedAmount))
        : Math.min(userCoinsAvailable, amount);
    }
    const coinsEarned = Math.max(10, Math.round(amount * 0.05));
    user.coins = Math.max(0, userCoinsAvailable - coinsRedeemed + coinsEarned);
    await user.save();

    // 💰 Increase Owner Wallet Balance (demo wallet)
    await OwnerModel.findOneAndUpdate(
      {},
      { $inc: { balance: amount } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Payment Successful & Order Created",
      transactionId,
      order: newOrder,
      userCoins: user.coins,
      coinsEarned,
    });
  } catch (error) {
    console.error("Order error:", error);
    return res.status(500).json({ message: "Order Failed", error });
  }
};


orderController.getPaymentInfo = async (req, res) => {
  try {
    console.log("called api");

    const userEmail = req.user.email;
    if (!userEmail) {
      throw new Error("User email not found...");
    }

    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      throw new Error("User not found...");
    }

    const orders = await OrderModel.find({ userId: user._id })
      
      .sort({ createdAt: -1 });

    console.log("orders:", orders);

    return res.status(200).json({
      success: true,
      orders,
      message: "Payment info fetched successfully",
    });
  } catch (error) {
    console.error("Get Payment Info error:", error);
    return res
      .status(500)
      .json({ message: "Failed to get payment info", error: error.message });
  }
};


module.exports = orderController;
