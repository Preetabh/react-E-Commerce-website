/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from 'framer-motion';
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "../../App.css";
import Swal from "sweetalert2";
import { Package, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          Toastify({
            text: `Please sign in to view your orders.`,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: { background: "#1d1d1f", color: "#fff", borderRadius: "12px", padding: "12px 20px" },
          }).showToast();
          return navigate('/users/login');
        }

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/myorders`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setOrders(response?.data?.orders || []);

      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setTimeout(() => navigate("/users/login"), 1000);
        } else {
          setError(error.response?.data?.message || "Failed to fetch orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId, ordername) => {
    try {
      const token = localStorage.getItem("token");
      const result = await Swal.fire({
        title: `Cancel Order?`,
        text: `Are you sure you want to cancel ${ordername}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Cancel Order",
        cancelButtonText: "Keep Order",
        confirmButtonColor: "#ff3b30",
        cancelButtonColor: "#1d1d1f",
        customClass: {
          popup: 'rounded-3xl font-sans'
        }
      });

      if (!result.isConfirmed) return;
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/users/myorders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setOrders(orders.filter(order => order._id !== orderId));
      Toastify({
        text: `Order ${ordername} cancelled successfully.`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "#ff3b30", color: "#fff", borderRadius: "12px" },
      }).showToast();

    } catch (error) {
      setError("Failed to cancel order");
    }
  };

  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="border-b border-black/10 pb-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
            Order History
          </h1>
          <p className="text-sm text-[#86868b] mt-1">
            Track and manage your recent device purchases.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold">×</button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <motion.div
              className="w-10 h-10 border-4 border-[#0071e3] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-sm text-[#86868b] mt-4 font-medium">Fetching order records...</p>
          </div>
        ) : (Array.isArray(orders) && orders.length > 0) ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {[...orders]
              .sort((a, b) => new Date(b.orderDate || b.createdAt || 0) - new Date(a.orderDate || a.createdAt || 0))
              .map((order) => {
              const isCompleted = order.status === "completed";
              const isCancelled = order.status === "cancelled";
              const isPending = order.status === "pending";

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                  className="apple-card p-6 bg-white flex flex-col justify-between space-y-4 hover:shadow-xl transition"
                >
                  <Link to={`/products/${order.productId}`} className="flex items-start gap-4 group">
                    <div className="w-24 h-24 bg-[#fbfbfd] rounded-2xl flex items-center justify-center p-2 shrink-0">
                      <img
                        src={order.image || "https://via.placeholder.com/150"}
                        alt={order.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-base font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition line-clamp-2">
                        {order.name}
                      </h3>
                      <p className="text-lg font-extrabold text-[#1d1d1f]">
                        ₹{Number(order.price).toLocaleString("en-IN")}
                      </p>

                      <div className="pt-1 flex items-center gap-2">
                        <span className="text-xs font-medium text-[#86868b]">Status:</span>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            isCompleted
                              ? "bg-green-100 text-green-700"
                              : isCancelled
                              ? "bg-gray-100 text-gray-600"
                              : isPending
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="pt-3 border-t border-black/5 flex justify-end">
                    <button
                      onClick={() => handleCancelOrder(order._id, order.name)}
                      disabled={isCompleted || isCancelled}
                      className={`text-xs font-semibold py-2 px-4 rounded-full transition ${
                        isCompleted || isCancelled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      {isCancelled ? "Order Cancelled" : isCompleted ? "Delivered" : "Cancel Order"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="apple-card p-16 text-center max-w-xl mx-auto bg-white my-8 space-y-4">
            <div className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto text-[#86868b]">
              <Package size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#1d1d1f]">No Orders Placed Yet</h2>
            <p className="text-sm text-[#86868b]">
              When you purchase devices, your order tracking status will show up here.
            </p>
            <Link
              to="/"
              className="apple-btn-primary inline-flex items-center gap-2 text-sm py-2.5 px-6 shadow-md"
            >
              <span>Explore Store</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;

