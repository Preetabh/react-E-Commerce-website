import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Preloader from "./components/Preloader.jsx";
import TopLoader from "./components/TopLoader.jsx";
import Logo from "./components/Logo.jsx";

/* =======================
   User Pages (Lazy)
======================= */
import Home from "./pages/UserFolder/Home.jsx";
const UserCreate = lazy(() => import("./pages/UserFolder/userCreate.jsx"));
const UserLogin = lazy(() => import("./pages/UserFolder/userLogin.jsx"));
const UserProfile = lazy(() => import("./pages/UserFolder/userProfile.jsx"));
const UserProfileEdit = lazy(() => import("./pages/UserFolder/UserProfileEdit.jsx"));
const UserCart = lazy(() => import("./pages/UserFolder/getCartItems.jsx"));
const Buynow = lazy(() => import("./pages/UserFolder/buynowSummery.jsx"));
const OrderSuccess = lazy(() => import("./pages/UserFolder/orderSuccessPage.jsx"));
const MyOrders = lazy(() => import("./pages/UserFolder/myOrders.jsx"));
const ProductsDetails = lazy(() => import("./pages/UserFolder/ProductsDetails.jsx"));
const ForgetPassword = lazy(() => import("./pages/UserFolder/ForgetPassword.jsx"));
const AiCenter = lazy(() => import("./pages/UserFolder/AiCenter.jsx"));
const GoogleCallback = lazy(() => import("./pages/UserFolder/GoogleCallback.jsx"));
const Logout = lazy(() => import("./Logout.jsx"));

/* =======================
   Owner Pages (Lazy)
======================= */
const OwnerLogin = lazy(() => import("./pages/OwnerFolder/OwnerLogin.jsx"));
const OwnerCreate = lazy(() => import("./pages/OwnerFolder/OwnerCreate.jsx"));
const OwnerDashboard = lazy(() => import("./pages/OwnerFolder/OwnerDashboard.jsx"));
const OwnerAllItems = lazy(() => import("./pages/OwnerFolder/AllItems.jsx"));
const OwnerAddItems = lazy(() => import("./pages/OwnerFolder/AddItems.jsx"));
const OwnerProfile = lazy(() => import("./pages/OwnerFolder/Profile.jsx"));
const OwnerProfileEdit = lazy(() => import("./pages/OwnerFolder/EditProfile.jsx"));
const OwnerAllOrders = lazy(() => import("./pages/OwnerFolder/AllOrdersShow.jsx"));
const EditProduct = lazy(() => import("./pages/OwnerFolder/ItemsEdit.jsx"));

/* =======================
   Static Pages (Lazy)
======================= */
const Privacy = lazy(() => import("./pages/Static/Privacy.jsx"));
const Refund = lazy(() => import("./pages/Static/Refund.jsx"));
const Terms = lazy(() => import("./pages/Static/Terms.jsx"));
const Contact = lazy(() => import("./pages/Static/Contact.jsx"));
const Shipping = lazy(() => import("./pages/Static/Shipping.jsx"));

/* =======================
   Fallback / Protection
======================= */
const RouteProtection = lazy(() =>
  import("./pages/UserFolder/RouteProtection.jsx")
);

/* =======================
   Loader Component
======================= */
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-slate-800">
    <div className="animate-pulse mb-4">
      <Logo size="md" variant="default" animated={true} />
    </div>
    <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
    <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Loading Page...</span>
  </div>
);

/* =======================
   App Component
======================= */
const App = () => {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    console.log("🚀 [Shop Mart App Initialized]");
    console.log("📍 [Config Debug] VITE_BASE_URL:", import.meta.env.VITE_BASE_URL || "http://localhost:4000 (Default fallback)");
  }, []);

  return (
    <>
      {initialLoading && <Preloader onComplete={() => setInitialLoading(false)} />}
      <Router>
        <TopLoader />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>


        <Routes>
          <Route path="/" element={<Home />} />

          {/* Home */}

          {/* User Routes */}
          <Route path="/users/register" element={<UserCreate />} />
          <Route path="/users/login" element={<UserLogin />} />
          <Route path="/users/profile" element={<UserProfile />} />
          <Route path="/users/profile/edit" element={<UserProfileEdit />} />
          <Route path="/users/getCartItems" element={<UserCart />} />
          <Route path="/users/buynow/:id" element={<Buynow />} />
          <Route path="/users/orderSuccess/:id" element={<OrderSuccess />} />
          <Route path="/users/order" element={<MyOrders />} />
          <Route path="/users/helpcenter" element={<AiCenter />} />
          <Route path="/users/forgetPassword" element={<ForgetPassword />} />
          <Route path="/auth/success" element={<GoogleCallback />} />
          <Route path="/users/logout" element={<Logout />} />

          {/* Owner Routes */}
          <Route path="/owner/register" element={<OwnerCreate />} />
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/all-items" element={<OwnerAllItems />} />
          <Route path="/owner/add-items" element={<OwnerAddItems />} />
          <Route path="/owner/profile" element={<OwnerProfile />} />
          <Route path="/owner/editProfile" element={<OwnerProfileEdit />} />
          <Route path="/owner/AllOrders" element={<OwnerAllOrders />} />
          <Route path="/owner/EditProduct/:id" element={<EditProduct />} />

          {/* Product */}
          <Route path="/products/:id" element={<ProductsDetails />} />

          {/* Static Pages */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/contact" element={<Contact />} />

          {/* Fallback */}
          <Route path="*" element={<RouteProtection />} />
        </Routes>
      </Suspense>
    </Router>
    </>
  );
};

export default App;
