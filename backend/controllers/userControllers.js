require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("email-validator");
const userModel = require("../models/userModel");
const cartModel = require("../models/productModel");
const {SendEmail} = require("../config/EmailValidator");


const userControllers = {};

// 📌 Register User
userControllers.registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, contact, password } = req.body;

    if (!firstname || !lastname || !email || !contact || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.validate(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      firstname,
      lastname,
      email,
      contact,
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ Generate Token with 7 Days Expiry
    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    // ✅ Secure Cookie Settings
    res.cookie("token", token, {
      httpOnly: true,

    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        token,
        firstname,
        lastname,
        email,
        contact,
      },
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// 📌 Login User
userControllers.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Generate Secure Token
    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    // ✅ Store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true if using https
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: { firstname: user.firstname, lastname: user.lastname, email: user.email, contact: user.contact, token },
      token, // ✅ Send token in response so frontend can store it in localStorage
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// 📌 Logout User
userControllers.logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,

    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// 📌 remove cart
userControllers.removeCart = async (req, res) => {
  try {


    // ✅ Fetch token from cookies
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    if (!user.cart.includes(productId)) {
      return res.status(400).json({ message: "Product is not in the cart" });
    }
    // �� Remove the product from the user's cart using Mongoose's update operation



    const user = await userModel.findOneAndUpdate(
      { email: decoded.email },
      { $pull: { cart: { _id: productId } } }, // 🔥 Remove only the matching product
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "Item removed from cart", cart: user.cart });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


//Add to cart route
userControllers.Addtocart = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Add to cart only if not already added
    if (!user.cart.includes(productId)) {
      user.cart.push(productId);
      await user.save();
    }

    return res.status(200).json({ message: "Product added to cart successfully", cart: user.cart });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// Get Add to cart Route
userControllers.getCartItems = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const productId = req.params.itemId;


    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = await cartModel.find({ _id: { $in: user.cart } });

    if (!cartItems || cartItems.length === 0) {
      console.warn("⚠️ No items in cart for user:", email);
      return res.status(200).json([]); // Send an empty array if no items
    }



    return res.status(200).json(cartItems); // ✅ Send the array directly
  } catch (error) {
    console.error("Error in getCartItems:", error.message);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// 📌 Get User Profile
  userControllers.getUserProfile = async (req, res) => {
  try {
    // ✅ Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }

    const user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");



    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Convert profile picture to Base64 if exists
    let profilePictureBase64 = null;
    if (user.profilePicture && user.profilePicture.data) {
      profilePictureBase64 = `data:${user.profilePicture.contentType};base64,${user.profilePicture.data.toString("base64")}`;
    }

    // ✅ Send response
    return res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      contact: user.contact,
      address: user.address || {},
      coins: user.coins || 250,
      profilePicture: profilePictureBase64,
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


//Post Update user profile page
userControllers.updateUserProfile = async (req, res) => {
  try {

    const { firstname, lastname, contact, email, address } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (contact) user.contact = contact;

    let newToken = null;

    if (email && email !== user.email) {
      const emailExists = await userModel.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }

      user.email = email;
      newToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }

    if (req.file) {
      user.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    if (address) {
      let parsedAddress = {};
      if (typeof address === "string") {
        try { parsedAddress = JSON.parse(address); } catch (e) { parsedAddress = {}; }
      } else if (typeof address === "object" && address !== null) {
        parsedAddress = address;
      }

      user.address = {
        street: parsedAddress.street ?? user.address?.street ?? "",
        city: parsedAddress.city ?? user.address?.city ?? "",
        state: parsedAddress.state ?? user.address?.state ?? "",
        country: parsedAddress.country ?? user.address?.country ?? "",
      };
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      token: newToken || token, // ✅ Return updated token if changed
    });

  } catch (error) {
    console.error("Error updating user profile:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




// 📌 Buynow User
userControllers.buynowSuccessful = async (req, res) => {
  try {
    const { id: productId } = req.params; // Get product ID from URL
    const { quantity } = req.body; // Get quantity from request body

    // Check if token exists
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify JWT and extract user email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    // Find the user
    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product details
    const product = await cartModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate total price
    const totalPrice = product.price * (quantity || 1);

    const orderModel = require("../models/orderModel");

    // Create order object
    const newOrder = {
      productId,
      quantity: quantity || 1,
      price: totalPrice,
      status: "pending",
      orderDate: new Date(),
    };

    // Add order to the user's order list
    user.orders.push(newOrder);

    // Update coins (Earn 5% coins)
    const coinsEarned = Math.max(10, Math.round(totalPrice * 0.05));
    let coinDelta = coinsEarned;
    if (req.body.redeemCoins && (user.coins || 250) >= 250) {
      coinDelta -= 250;
    }
    user.coins = Math.max(0, (user.coins || 250) + coinDelta);

    await user.save();

    // Create central Order entry for owner dashboard tracking
    try {
      await orderModel.create({
        userId: user._id,
        productId,
        amount: totalPrice,
        paymentStatus: "Success",
        paymentMethod: req.body.paymentMethod || "COD",
        transactionId: "COD-" + Date.now(),
        status: "Confirmed",
      });
    } catch (e) {
      console.log("Central order logging note:", e.message);
    }

    return res.status(201).json({
      message: "Order placed successfully!",
      order: newOrder,
      userCoins: user.coins,
      coinsEarned,
    });

  } catch (error) {
    console.error("🚨 Order Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


//MyOrders
const Product = require("../models/productModel"); // Import Product model

// 📌 MyOrders User
userControllers.MyOrders = async (req, res) => {
  try {

    const token = req.headers.authorization.split(" ")[1];;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;


    const user = await userModel.findOne({ email: userEmail }).populate("orders");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch product details for each order using productId
    const ordersWithProductDetails = await Promise.all(
      user.orders.map(async (order) => {
        const product = await Product.findById(order.productId);


        return {
          productId: order.productId,
          _id: order._id,
          name: product?.name || "Unknown Product",
          image: product?.images?.[0]?.url || "",
          price: product?.price || order.price, // If price isn't in product, fallback to order
          quantity: order.quantity,
          status: order.status,
          orderDate: order.orderDate,
        };
      })
    );


      return res.status(200).json({ orders: ordersWithProductDetails });
  } catch (error) {
    console.error("MyOrders Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 📌 cancelOrder User
userControllers.cancelOrder = async (req, res) => {
  try {


    const token = req.headers.authorization.split(" ")[1];


    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { orderId } = req.params;

    // ✅ Check if order exists
    const orderIndex = user.orders.findIndex(order => order._id.toString() === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Remove order from user's orders array
    user.orders.splice(orderIndex, 1);
    await user.save();

    return res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Cancel Order Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// 📌 SendOtp User
userControllers.SendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ status: "error", message: "Email is required" });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Save OTP + Expiry
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    // ✅ Send OTP via Email
    await SendEmail(
      email,
      "Your OTP Code",
      `${otp}.  It will expire in 5 minutes.`,
    );

    return res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
      expiry,
      info: "Check your email for the OTP. It is valid for 5 minutes."
    });
  } catch (error) {
    console.error("❌ OTP HAS NOT BEEN GENERATED:", error.message);
    return res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};


// 📌 ResetPassword User
userControllers.ResetPassword = async (req, res) => {
  try {
    const { email, otp, newpassword } = req.body;

    // 1. Validate fields
    if (!email || !otp || !newpassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Check OTP validity
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 4. Check OTP expiry
    if (!user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // 5. Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);

    // 6. Update password & clear OTP
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("PASSWORD NOT UPDATED:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 📌 Google Auth Redirect
userControllers.googleAuthRedirect = (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.get("host");
  const defaultCallback = `${protocol}://${host}/auth/google/callback`;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || defaultCallback;

  const { OAuth2Client } = require("google-auth-library");
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  });

  return res.redirect(authUrl);
};

// 📌 Google Auth Callback
userControllers.googleAuthCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send("Authorization code missing from Google redirect.");
    }

    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.get("host");
    const defaultCallback = `${protocol}://${host}/auth/google/callback`;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || defaultCallback;

    const { OAuth2Client } = require("google-auth-library");
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const userinfoResp = await client.request({
      url: "https://www.googleapis.com/oauth2/v3/userinfo"
    });

    const { sub, email, given_name, family_name, picture } = userinfoResp.data;

    if (!email) {
      return res.status(400).send("Unable to retrieve email from Google account.");
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      user = new userModel({
        firstname: given_name || "Google",
        lastname: family_name || "User",
        email,
        googleId: sub,
        googleProfilePic: picture,
        contact: "0000000000"
      });
      await user.save();
    } else {
      if (!user.googleId) {
        user.googleId = sub;
      }
      if (picture && !user.googleProfilePic) {
        user.googleProfilePic = picture;
      }
      await user.save();
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const frontendUrl = process.env.FRONTEND_URL || `${protocol}://${host}`;
    return res.redirect(`${frontendUrl}/#/auth/success?token=${encodeURIComponent(token)}`);
  } catch (error) {
    console.error("Google Auth Callback Error:", error);
    return res.status(500).send("Authentication failed: " + error.message);
  }
};

// 📌 Google One Tap / ID Token Login
userControllers.googleOneTapLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const { OAuth2Client } = require("google-auth-library");
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub, email, given_name, family_name, picture } = payload;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = new userModel({
        firstname: given_name || "Google",
        lastname: family_name || "User",
        email,
        googleId: sub,
        googleProfilePic: picture,
        contact: "0000000000"
      });
      await user.save();
    } else {
      if (!user.googleId) {
        user.googleId = sub;
      }
      if (picture && !user.googleProfilePic) {
        user.googleProfilePic = picture;
      }
      await user.save();
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Google login successful",
      user: { firstname: user.firstname, lastname: user.lastname, email: user.email, token },
      token
    });
  } catch (error) {
    console.error("Google OneTap Error:", error.message);
    return res.status(500).json({ message: "Google authentication failed", error: error.message });
  }
};

// 📌 GitHub Auth Redirect
userControllers.githubAuthRedirect = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID || "Ov23liiEbq9H0DPzGYju";
  const redirectUri = process.env.GITHUB_CALLBACK_URL || "http://localhost:4000/api/auth/github/callback";
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
  return res.redirect(githubAuthUrl);
};

// 📌 GitHub Auth Callback
userControllers.githubAuthCallback = async (req, res) => {
  try {
    const axios = require("axios");
    const { code } = req.query;
    if (!code) {
      return res.status(400).send("Authorization code missing from GitHub redirect.");
    }

    const clientId = process.env.GITHUB_CLIENT_ID || "Ov23liiEbq9H0DPzGYju";
    const clientSecret = process.env.GITHUB_CLIENT_SECRET || "11ad3c40eb3151ce08702955e2ea9c71887010b7";

    // 1. Exchange authorization code for GitHub access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      console.error("❌ GitHub OAuth Token Error response:", tokenResponse.data);
      return res.status(400).send("Failed to obtain access token from GitHub.");
    }

    // 2. Fetch GitHub user profile
    const userProfileResp = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const ghUser = userProfileResp.data;

    // 3. Fetch GitHub primary email
    let email = ghUser.email;
    if (!email) {
      const emailsResp = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (Array.isArray(emailsResp.data)) {
        const primaryEmailObj = emailsResp.data.find((e) => e.primary && e.verified) || emailsResp.data[0];
        email = primaryEmailObj?.email;
      }
    }

    if (!email) {
      email = `${ghUser.login}@github.com`;
    }

    const nameParts = (ghUser.name || ghUser.login || "GitHub User").trim().split(" ");
    const firstname = nameParts[0] || "GitHub";
    const lastname = nameParts.slice(1).join(" ") || "Member";

    let user = await userModel.findOne({ email });

    if (!user) {
      user = new userModel({
        firstname,
        lastname,
        email,
        githubId: String(ghUser.id),
        googleProfilePic: ghUser.avatar_url,
        contact: "0000000000",
      });
      await user.save();
    } else {
      if (!user.githubId) {
        user.githubId = String(ghUser.id);
      }
      if (ghUser.avatar_url && !user.googleProfilePic) {
        user.googleProfilePic = ghUser.avatar_url;
      }
      await user.save();
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontendUrl}/#/auth/success?token=${encodeURIComponent(token)}`);
  } catch (error) {
    console.error("❌ GitHub Auth Callback Error:", error.message);
    res.status(500).send("GitHub authentication failed: " + error.message);
  }
};

module.exports = userControllers;

