const express = require("express");
const { registerUser, loginUser, SendOtp, logoutUser, getUserProfile, ResetPassword, buynowSuccessful, MyOrders, cancelOrder, updateUserProfile, Addtocart, getCartItems, googleAuthRedirect, googleAuthCallback, googleOneTapLogin } = require("../controllers/userControllers");
const upload = require("../config/multer-config");
const authMiddleware = require("../middlewares/AuthMiddleware");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/auth/google", googleAuthRedirect);
router.get("/auth/google/callback", googleAuthCallback);
router.post("/google-login", googleOneTapLogin);
router.post("/addtocart", Addtocart);
router.post("/buynowSuccessful/:id", buynowSuccessful);
router.get("/myorders", MyOrders);
router.post("/send-otp", SendOtp);
router.post("/reset-password", ResetPassword);

router.delete("/myorders/:orderId", cancelOrder);



router.post("/logout",authMiddleware, logoutUser);
router.get("/profile",authMiddleware, getUserProfile); // ✅ Protected Route
router.get("/getCartItems",authMiddleware, getCartItems); // ✅ Protected Route
router.post("/removeCart/:itemId", async (req, res) => {
  try {


    const token =  req.headers.authorization?.split(" ")[1];
    const cartItemId = req.params.itemId; // Ye cart item ka _id hai, productId nahi

    if (!token || !cartItemId) {
      return res.status(401).json({ message: "Unauthorized: No token or Cart Item ID provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Sirf cart ke andar se cart item ka `_id` remove karo
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id, // ✅ Correct User ID
      { $pull: { cart: cartItemId } }, // ✅ Directly cartItemId use kar raha hai
      { new: true }
    );;

    return res.status(200).json({ message: "Item removed successfully", cart: updatedUser.cart });

  } catch (error) {
    console.error("Error removing item from cart:", error);
    return res.status(500).json({ message: "Error removing item from cart" });
  }
});


router.post("/profile/edit",  upload.single("profilePicture"), updateUserProfile); // ✅ Protected Route




module.exports = router;
