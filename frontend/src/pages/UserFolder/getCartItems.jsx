/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Truck } from "lucide-react";
import "./CartItems.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
const baseURL = import.meta.env.VITE_BASE_URL;
import "../../App.css";

const GetCartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please sign in to view your Bag.");
          setTimeout(() => navigate("/users/login"), 1000);
          return;
        }
        const response = await axios.get(`${baseURL}/users/getCartItems`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setCartItems(response.data || []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Please sign in to view your Bag.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/users/login"), 1000);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, [navigate]);

  const getItemQuantity = (itemId) => itemQuantities[itemId] || 1;

  const handleQuantityChange = (itemId, delta) => {
    setItemQuantities((prev) => {
      const current = prev[itemId] || 1;
      const updated = Math.max(1, current + delta);
      return { ...prev, [itemId]: updated };
    });
  };

  const handleRemoveItem = async (itemId, itemName) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/removeCart/${itemId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setCartItems((prevCart) => prevCart.filter((item) => item._id !== itemId));
      toast.success(`${itemName} removed from Bag`);
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item from Bag ❌");
    }
  };

  const handleBuyAllItems = () => {
    if (cartItems.length === 0) return;
    navigate("/users/buynow/all");
  };

  const totalCartPrice = cartItems.reduce(
    (total, item) =>
      total + Number(item.discount || item.price) * getItemQuantity(item._id),
    0
  );

  const totalCartCount = cartItems.reduce(
    (total, item) => total + getItemQuantity(item._id),
    0
  );

  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="text-[#0071e3]"
            >
              <ShoppingBag size={56} />
            </motion.div>
            <p className="mt-4 text-base font-medium text-[#86868b]">
              Reviewing your Bag...
            </p>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="space-y-8">
            <div className="border-b border-black/10 pb-6">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
                Review your Bag.
              </h1>
              <p className="text-sm text-[#86868b] mt-1">
                Free shipping and free returns on all items.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Items List */}
              <div className="lg:col-span-8 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="apple-card p-6 bg-white flex flex-col sm:flex-row items-center gap-6"
                  >
                    <Link
                      to={`/products/${item._id}`}
                      className="w-32 h-32 bg-[#fbfbfd] rounded-2xl flex items-center justify-center p-3 shrink-0 hover:bg-[#f5f5f7] transition"
                    >
                      <img
                        src={
                          item.images?.[0]?.url ||
                          item.image?.url ||
                          "https://via.placeholder.com/150"
                        }
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </Link>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                        <h3 className="text-lg font-bold text-[#1d1d1f] hover:text-[#0071e3] transition">
                          <Link to={`/products/${item._id}`}>{item.name}</Link>
                        </h3>
                        <div className="text-right">
                          <span className="text-xl font-bold text-[#1d1d1f]">
                            ₹{(Number(item.discount || item.price) * getItemQuantity(item._id)).toLocaleString("en-IN")}
                          </span>
                          {item.discount && item.price > item.discount && (
                            <span className="block text-xs text-[#86868b] line-through">
                              ₹{(Number(item.price) * getItemQuantity(item._id)).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-[#86868b] line-clamp-2">
                        {item.details}
                      </p>

                      <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                        {/* Quantity Counter Buttons */}
                        <div className="flex items-center gap-2 bg-[#f5f5f7] px-3 py-1.5 rounded-full border border-black/10 shadow-inner">
                          <span className="text-xs font-semibold text-[#86868b]">Qty:</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, -1)}
                            className="w-6 h-6 rounded-full bg-white shadow-xs font-extrabold text-xs flex items-center justify-center text-[#1d1d1f] hover:bg-slate-200 active:scale-90 transition select-none"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-xs text-[#1d1d1f] px-1 min-w-4 text-center">
                            {getItemQuantity(item._id)}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item._id, 1)}
                            className="w-6 h-6 rounded-full bg-white shadow-xs font-extrabold text-xs flex items-center justify-center text-[#1d1d1f] hover:bg-slate-200 active:scale-90 transition select-none"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <Link
                          to={`/users/buynow/${item._id}`}
                          className="apple-btn-primary text-xs py-2 px-4"
                        >
                          Checkout Item
                        </Link>
                        <button
                          onClick={() => handleRemoveItem(item._id, item.name)}
                          className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium py-1 px-2 rounded-lg hover:bg-red-50 transition"
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-4">
                <div className="apple-card p-6 sm:p-8 bg-white sticky top-24 space-y-6">
                  <h2 className="text-xl font-bold text-[#1d1d1f]">Order Summary</h2>

                  <div className="space-y-3 text-sm border-b border-black/5 pb-4">
                    <div className="flex justify-between text-[#515154]">
                      <span>Subtotal ({totalCartCount} items)</span>
                      <span className="font-semibold text-[#1d1d1f]">
                        ₹{totalCartPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#515154]">
                      <span>Standard Shipping</span>
                      <span className="text-green-600 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between text-[#515154]">
                      <span>Estimated Tax</span>
                      <span className="text-[#1d1d1f]">Included</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline text-lg font-bold text-[#1d1d1f]">
                    <span>Total</span>
                    <span className="text-2xl text-[#0071e3]">
                      ₹{totalCartPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
                    onClick={handleBuyAllItems}
                    className="w-full apple-btn-primary py-3.5 flex items-center justify-center gap-2 text-base font-semibold shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>Check Out All Items</span>
                    <ArrowRight size={18} />
                  </button>

                  <div className="pt-2 text-center text-xs text-[#86868b] space-y-1">
                    <p className="flex items-center justify-center gap-1">
                      <Truck size={14} /> Free Express Delivery Included
                    </p>
                    <p className="flex items-center justify-center gap-1">
                      <ShieldCheck size={14} /> 256-bit Secure Encryption
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="apple-card p-12 sm:p-20 text-center max-w-2xl mx-auto bg-white my-10 space-y-4">
            <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto text-[#86868b]">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f]">
              Your Bag is empty.
            </h2>
            <p className="text-sm text-[#86868b] max-w-md mx-auto">
              Items added to your bag will appear here. Explore our flagship tech selection to get started.
            </p>
            <Link
              to="/"
              className="apple-btn-primary inline-flex items-center gap-2 text-sm py-3 px-6 mt-4 shadow-md"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
    </div>
  );
};

export default GetCartItems;

