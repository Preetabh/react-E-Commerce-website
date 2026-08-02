/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "../../App.css";
import Swal from "sweetalert2";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Receipt,
  Truck,
  CreditCard,
  Search,
  RotateCcw,
  ShieldCheck,
  Building2,
  Printer
} from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          Toastify({
            text: "Please sign in to view your order history.",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
              background: "#1d1d1f",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 20px",
            },
          }).showToast();
          return navigate("/users/login");
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/myorders`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
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
        text: `Are you sure you want to cancel "${ordername}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Cancel Order",
        cancelButtonText: "Keep Order",
        confirmButtonColor: "#ff3b30",
        cancelButtonColor: "#1d1d1f",
        customClass: {
          popup: "rounded-3xl font-sans",
        },
      });

      if (!result.isConfirmed) return;
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/users/myorders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setOrders(orders.filter((order) => order._id !== orderId));
      Toastify({
        text: `Order "${ordername}" cancelled successfully.`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "#ff3b30", color: "#fff", borderRadius: "12px" },
      }).showToast();
    } catch (error) {
      setError("Failed to cancel order");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.orderId || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "delivered") {
      return matchesSearch && order.status?.toLowerCase() === "delivered";
    }
    if (activeTab === "cancelled") {
      return matchesSearch && order.status?.toLowerCase() === "cancelled";
    }
    if (activeTab === "confirmed") {
      return (
        matchesSearch &&
        (order.status?.toLowerCase() === "confirmed" ||
          order.status?.toLowerCase() === "pending")
      );
    }
    return matchesSearch;
  });

  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Flipkart / Amazon Style Header */}
        <div className="border-b border-black/10 pb-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1d1d1f]">
                My Orders &amp; Purchase History
              </h1>
              <p className="text-sm text-[#86868b] mt-1">
                Track shipments, download invoices, view payment modes, and manage your orders.
              </p>
            </div>

            {/* Quick Order Stats Bar */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-black/5 shadow-xs shrink-0">
              <div className="text-center px-3 border-r border-black/5">
                <span className="text-xs text-[#86868b] block font-medium">Total Orders</span>
                <span className="text-base font-extrabold text-[#1d1d1f]">{orders.length}</span>
              </div>
              <div className="text-center px-3">
                <span className="text-xs text-[#86868b] block font-medium">Verified Account</span>
                <span className="text-xs font-bold text-green-600 flex items-center justify-center gap-1">
                  <ShieldCheck size={14} /> Active
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Tabs */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: "all", label: `All Orders (${orders.length})` },
                { id: "confirmed", label: "Confirmed" },
                { id: "delivered", label: "Delivered" },
                { id: "cancelled", label: "Cancelled" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#0071e3] text-white shadow-md shadow-blue-500/20"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input Box */}
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders or IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold">
              ×
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <motion.div
              className="w-10 h-10 border-4 border-[#0071e3] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-sm text-[#86868b] mt-4 font-medium">
              Fetching order records...
            </p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {[...filteredOrders]
              .sort(
                (a, b) =>
                  new Date(b.orderDate || b.createdAt || 0) -
                  new Date(a.orderDate || a.createdAt || 0)
              )
              .map((order) => {
                const isCompleted = order.status?.toLowerCase() === "delivered";
                const isCancelled = order.status?.toLowerCase() === "cancelled";
                const isCOD =
                  (order.paymentMethod || "").toLowerCase().includes("cod") ||
                  (order.paymentMethod || "").toLowerCase().includes("delivery");

                const formattedDate = new Date(
                  order.orderDate || order.createdAt || Date.now()
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    layout
                    className="apple-card p-6 bg-white space-y-6 shadow-md hover:shadow-xl transition rounded-3xl border border-slate-200/80"
                  >
                    {/* Top Flipkart-Style Order Header */}
                    <div className="flex flex-wrap justify-between items-center pb-4 border-b border-slate-100 gap-3 text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full font-bold">
                          ID: {order.orderId || `ORD-${order._id.slice(-6)}`}
                        </span>
                        <span>Placed on: <strong className="text-slate-800">{formattedDate}</strong></span>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                            isCompleted
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : isCancelled
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={13} />
                          ) : isCancelled ? (
                            <XCircle size={13} />
                          ) : (
                            <Clock size={13} />
                          )}
                          {order.status || "Confirmed"}
                        </span>
                      </div>
                    </div>

                    {/* Main Content Info */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Product Thumbnail & Title */}
                      <div className="md:col-span-6 flex items-center gap-5">
                        <Link
                          to={`/products/${order.productId}`}
                          className="w-24 h-24 bg-[#fbfbfd] rounded-2xl flex items-center justify-center p-2 shrink-0 border border-slate-100 hover:scale-105 transition-transform"
                        >
                          <img
                            src={
                              order.image ||
                              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600"
                            }
                            alt={order.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </Link>

                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block">
                            Shop Mart Verified
                          </span>
                          <h3 className="text-base font-bold text-[#1d1d1f] hover:text-[#0071e3] transition line-clamp-2">
                            <Link to={`/products/${order.productId}`}>{order.name}</Link>
                          </h3>
                          <span className="text-xs text-slate-500 block">
                            Qty: <strong>{order.quantity || 1}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Payment Mode & Price Breakdown */}
                      <div className="md:col-span-3 space-y-1 text-left md:text-right border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
                        <span className="text-xs text-slate-500 font-medium block">Total Paid</span>
                        <div className="text-2xl font-extrabold text-[#1d1d1f]">
                          ₹{Number(order.price || 0).toLocaleString("en-IN")}
                        </div>

                        {/* Payment Mode Tag */}
                        <div className="pt-1 flex items-center md:justify-end gap-1 text-xs font-bold text-slate-700">
                          {isCOD ? (
                            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                              💵 Cash on Delivery
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                              <CreditCard size={13} /> Paid Online (Card/UPI)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delivery Address & Status Callout */}
                      <div className="md:col-span-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Truck size={14} className="text-blue-600" /> Delivery Address
                        </div>
                        <p className="line-clamp-2 font-medium text-slate-700">
                          {order.shippingAddress || "Standard Home Delivery"}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Buyer: {order.customerName || "Customer"}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                      >
                        <Receipt size={14} />
                        <span>View Invoice Receipt</span>
                      </button>

                      <div className="flex items-center gap-3">
                        <Link
                          to={`/products/${order.productId}`}
                          className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 hover:underline px-3 py-2"
                        >
                          <RotateCcw size={13} /> Buy Again
                        </Link>

                        <button
                          onClick={() => handleCancelOrder(order._id, order.name)}
                          disabled={isCompleted || isCancelled}
                          className={`text-xs font-extrabold py-2 px-4 rounded-full transition cursor-pointer ${
                            isCompleted || isCancelled
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                          }`}
                        >
                          {isCancelled
                            ? "Order Cancelled"
                            : isCompleted
                            ? "Delivered"
                            : "Cancel Order"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        ) : (
          <div className="apple-card p-16 text-center max-w-xl mx-auto bg-white my-8 space-y-4 shadow-xl">
            <div className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto text-[#86868b]">
              <Package size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#1d1d1f]">No Orders Placed Yet</h2>
            <p className="text-sm text-[#86868b]">
              When you purchase flagship tech items, your order history and live delivery tracking will show up here.
            </p>
            <Link
              to="/"
              className="apple-btn-primary inline-flex items-center gap-2 text-sm py-2.5 px-6 shadow-md"
            >
              <span>Explore Flagship Store</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </main>

      {/* Printable Invoice / Receipt Modal */}
      <AnimatePresence>
        {selectedReceiptOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="apple-card p-6 sm:p-8 bg-white max-w-lg w-full space-y-6 shadow-2xl relative border border-slate-200"
            >
              {/* Receipt Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 size={20} className="text-blue-600" />
                    <span className="font-black text-lg text-slate-900">SHOP MART LUXURY</span>
                  </div>
                  <p className="text-xs text-slate-500">Tax Invoice &amp; Official Purchase Receipt</p>
                </div>
                <button
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="text-slate-400 hover:text-slate-700 font-extrabold text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Receipt Details */}
              <div className="space-y-4 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-semibold">Order ID</span>
                    <strong className="text-slate-900">{selectedReceiptOrder.orderId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Transaction ID</span>
                    <strong className="text-slate-900">{selectedReceiptOrder.transactionId}</strong>
                  </div>
                </div>

                <div className="space-y-2 border-b border-slate-200 pb-4">
                  <span className="font-bold text-slate-900 block">Item Summary</span>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-800">{selectedReceiptOrder.name}</span>
                    <span className="font-extrabold text-slate-900">
                      ₹{Number(selectedReceiptOrder.price || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Quantity</span>
                    <span>{selectedReceiptOrder.quantity || 1}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Express Shipping</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Tax &amp; GST</span>
                    <span className="text-slate-700 font-bold">Included</span>
                  </div>
                </div>

                {/* Payment & Delivery Breakdown */}
                <div className="space-y-2 border-b border-slate-200 pb-4">
                  <div className="flex justify-between items-center text-sm font-extrabold">
                    <span>Total Paid</span>
                    <span className="text-blue-600 text-lg">
                      ₹{Number(selectedReceiptOrder.price || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Payment Mode:</span>
                    <strong className="text-slate-900">{selectedReceiptOrder.paymentMethod}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Payment Status:</span>
                    <span className="text-green-600 font-bold">✅ Paid (Success)</span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Delivered To:</span>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {selectedReceiptOrder.customerName}<br />
                    {selectedReceiptOrder.shippingAddress}<br />
                    Contact: {selectedReceiptOrder.contact}
                  </p>
                </div>
              </div>

              {/* Print / Close Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-1/2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition text-xs cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default MyOrders;
