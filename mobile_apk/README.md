# Shop Mart Mobile Application (`mobile_apk`)

This is the official **React Native (Expo)** mobile application for **Shop Mart**, fully integrated with the Node.js/Express backend APIs.

## 📱 Features

### User / Customer Features:
- 🛍️ **Product Catalog**: Explore top products with search, category filtering, ratings, and price discounts.
- 🔍 **Detailed Product Specs**: Multi-image view, stock status, ratings, reviews, and related product suggestions.
- 🛒 **Shopping Cart**: Real-time quantity management, subtotal breakdown, free delivery eligibility, and item removal.
- 💳 **Checkout & Payment**: Address details, Cash on Delivery (COD) or Online Payment option.
- 📦 **Order Tracking & History**: View past orders, order status badges (Pending, Shipped, Delivered), and cancel pending orders.
- 🤖 **AI Shopping Assistant**: Interactive chatbot for shopping help, product recommendations, and policies.
- 👤 **Profile & Photo Upload**: View profile, edit details, and upload avatar photos.

### Store Owner / Seller Features:
- 📊 **Seller Dashboard**: Real-time metrics (Total products, total orders, estimated revenue).
- 🏪 **Inventory Management**: View all listed items, search inventory, edit product details, or delete items.
- ➕ **Publish Products**: Add new products with title, category, price, discount, stock, and up to 5 image uploads.
- 🚚 **Order Fulfillment**: Track customer orders and update status (`Shipped`, `Delivered`).

---

## 🚀 Getting Started

### 1. Install Dependencies
Navigate into the `mobile_apk` directory and install NPM packages:
```bash
cd mobile_apk
npm install
```

### 2. Configure Backend API URL
Open `src/api/config.js` and set the backend URL:
- **Android Emulator**: `http://10.0.2.2:4000` (Default)
- **iOS Simulator**: `http://localhost:4000`
- **Physical Phone (Expo Go)**: `http://<YOUR_LOCAL_IP>:4000` (e.g. `http://192.168.1.5:4000`)
- **Live Server**: `https://biggest-shop-mart.onrender.com`

### 3. Run the Mobile App
```bash
# Start Expo dev server
npx expo start

# Run directly on Android Emulator
npx expo run:android

# Run directly on iOS Simulator (Mac)
npx expo run:ios
```

---

## 📦 Building Standalone Android APK

To generate a standalone APK for testing or distribution:

### Option A: Local Android Build
```bash
npx expo run:android --variant release
```

### Option B: Expo EAS Cloud Build (EAS CLI)
```bash
npm install -g eas-cli
eas build -p android --profile preview
```
This produces an `.apk` file that can be installed on any Android phone directly.
