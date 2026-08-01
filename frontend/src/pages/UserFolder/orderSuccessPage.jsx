import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";
import "../../App.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Order Details Error:", error.message);
      }
    };

    fetchOrderDetails();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          navigate("/");
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [id, navigate]);

  const earnedCoins = product
    ? Math.min(150, Math.max(10, Math.round((product.discount || product.price) * 0.01)))
    : 150;

  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f]">
      <ToastContainer />
      <Navbar />

      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <div className="apple-card p-8 sm:p-12 bg-white text-center shadow-xl space-y-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#86868b] uppercase tracking-widest">
              ORDER CONFIRMED
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
              Thank you for your order.
            </h1>
            <p className="text-sm text-[#86868b]">
              We’ve received your order and are preparing it for shipment.
            </p>

            {/* Reward Coins Banner */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-amber-900 animate-bounce mt-2">
              <span className="text-base animate-coin">🪙</span>
              <span>Congratulations! You earned +{earnedCoins} Shop Mart Reward Coins on this order!</span>
            </div>
          </div>

          {product ? (
            <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-black/5 text-left flex items-center gap-4 my-6">
              <img
                src={product.images?.[0]?.url || product.image?.url || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-20 h-20 bg-white rounded-xl p-2 object-contain shrink-0"
              />
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-base text-[#1d1d1f] line-clamp-1">{product.name}</h3>
                <p className="text-xs text-[#86868b]">Quantity: 1 Item</p>
                <p className="text-base font-extrabold text-[#0071e3]">
                  ₹{(product.discount || product.price).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#86868b]">Loading order summary...</p>
          )}

          <div className="pt-2 text-xs text-[#86868b]">
            Redirecting to home page in <span className="font-semibold text-[#1d1d1f]">{countdown}s</span>...
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              to="/users/order"
              className="apple-btn-dark flex-1 py-3 text-sm flex items-center justify-center gap-2"
            >
              <Package size={16} />
              <span>View My Orders</span>
            </Link>
            <Link
              to="/"
              className="apple-btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2"
            >
              <span>Back to Store</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
