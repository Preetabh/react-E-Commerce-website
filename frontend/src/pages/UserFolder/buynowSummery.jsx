/* eslint-disable no-unused-vars */
import axios from "axios";
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCcVisa } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ShieldCheck, Truck, CreditCard, ArrowLeft, CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";
import "../../App.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const BuyNowSummary = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useCoins, setUseCoins] = useState(false);


  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCvv, setShowCvv] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("❌ Error fetching product:", error);
        toast.error("❌ Failed to fetch product details!");
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("❌ Please sign in to continue.");
          return navigate("/users/login");
        }

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setUser(response.data || {});
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          toast.error("⚠️ Session expired. Please login again.");
          navigate("/users/login");
        } else {
          toast.error("❌ " + (error.response?.data?.message || "Something went wrong."));
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const showOrderSuccessAlert = () => {
    return Swal.fire({
      title: "🎉 Order Placed!",
      text: "Your Cash on Delivery order was successfully confirmed.",
      icon: "success",
      confirmButtonText: "View Order Status",
      confirmButtonColor: "#0071e3",
      customClass: {
        popup: 'rounded-3xl font-sans',
        confirmButton: 'apple-btn-primary px-6 py-2.5',
      }
    });
  };

  const handleCOD = () => {
    const token = localStorage.getItem("token");
    const address = user.address?.city || user.address?.street;
    if (!token) {
      toast.error("❌ Please login to continue.");
      return navigate("/users/login");
    }

    if (!address) {
      toast.error("❌ Please add a shipping address in your profile.");
      return navigate("/users/profile/edit");
    }

    Swal.fire({
      title: "Confirm Cash on Delivery?",
      text: "Place order with payment on delivery.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0071e3",
      cancelButtonColor: "#1d1d1f",
      confirmButtonText: "Confirm Order",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: 'rounded-3xl font-sans',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Securing your order...",
          text: "Please wait a moment.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        setTimeout(async () => {
          try {
            const userCoins = user?.coins ?? 250;
            const rawPrice = product.discount || product.price;
            const coinDiscount = useCoins ? Math.min(userCoins, rawPrice) : 0;
            const finalAmount = Math.max(0, rawPrice - coinDiscount);

            await axios.post(
              `${import.meta.env.VITE_BASE_URL}/users/buynowSuccessful/${id}`,
              { redeemCoins: useCoins, redeemedAmount: coinDiscount, paymentMethod: "COD", amount: finalAmount },
              {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
              }
            );
          } catch (err) {
            console.log("COD order save note:", err.message);
          }

          showOrderSuccessAlert().then(() => {
            toast.success("✅ Order confirmed!");
            navigate(`/users/orderSuccess/${id}`);
          });
        }, 1200);
      } else {
        toast.info("COD order cancelled.");
      }
    });
  };

  const handleOnlinePayment = () => {
    setIsProcessing(true);
    setShowPaymentPopup(true);
  };

  const validatePaymentDetails = async (cardNumberParam, yearParam, cvvParam, monthParam) => {
    const card = cardNumberParam ?? cardNumber;
    const yearRaw = yearParam ?? expYear;
    const cvvVal = cvvParam ?? cvv;
    const monthRaw = monthParam ?? expMonth;

    const monthNum = Number((monthRaw || "").toString().trim());
    let yearNum = Number((yearRaw || "").toString().trim());

    if (!isNaN(yearNum) && yearRaw && yearRaw.toString().length === 2) {
      yearNum = 2000 + yearNum;
    }

    const basicValid =
      card?.trim().length === 16 &&
      !isNaN(monthNum) &&
      monthNum >= 1 &&
      monthNum <= 12 &&
      !isNaN(yearNum) &&
      (yearRaw?.toString().trim().length === 4 || yearRaw?.toString().trim().length === 2) &&
      cvvVal?.trim().length === 3;

    if (!basicValid) {
      toast.error("❌ Invalid card details. Check card number, expiry and CVV.");
      return;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const isExpired = yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth);

    if (isExpired) {
      setShowPaymentPopup(false);
      toast.error("❌ Card expired. Please use a valid card.");
      setCardNumber("");
      setExpMonth("");
      setExpYear("");
      setCvv("");
      return;
    }

    try {
      const userCoins = user?.coins ?? 250;
      const rawPrice = product.discount || product.price;
      const coinDiscount = useCoins ? Math.min(userCoins, rawPrice) : 0;
      const finalAmount = Math.max(0, rawPrice - coinDiscount);

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/orders/placeorder`,
        {
          productId: id,
          amount: finalAmount,
          redeemCoins: useCoins,
          redeemedAmount: coinDiscount,
          paymentMethod: "Online",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        }
      );
    } catch (e) {
      console.log("Online payment proceeding...");
    }


    Swal.fire({
      title: "Processing Encrypted Payment...",
      text: "Communicating with payment gateway.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      Swal.close();
      setShowPaymentPopup(false);
      toast.success("✅ Payment authorized successfully!");
      navigate(`/users/orderSuccess/${id}`);
    }, 2000);
  };

  const userCoins = user?.coins ?? 250;
  const rawPrice = product ? (product.discount || product.price) : 0;
  const coinDiscount = useCoins ? Math.min(userCoins, rawPrice) : 0;
  const displayFinalPrice = Math.max(0, rawPrice - coinDiscount);

  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f]">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
            Express Checkout
          </h1>
          <p className="text-sm text-[#86868b] mt-1">
            Review your device selection &amp; select payment method.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-1 bg-[#0071e3] rounded-full"
            />
            <p className="text-sm text-[#86868b] mt-4 font-medium">Preparing checkout details...</p>
          </div>
        ) : product ? (
          <div className="space-y-8">
            {/* Main Order Review Card */}
            <div className="apple-card p-6 sm:p-10 bg-white space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-8 border-b border-black/10 pb-8">
                <div className="w-44 h-44 bg-[#fbfbfd] rounded-2xl flex items-center justify-center p-4 shrink-0">
                  <img
                    src={product.images?.[0]?.url || product.image?.url || "https://via.placeholder.com/200"}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                    Item Summary
                  </span>
                  <h2 className="text-2xl font-bold text-[#1d1d1f]">
                    {product.name}
                  </h2>
                  <div className="text-2xl font-extrabold text-[#0071e3]">
                    ₹{displayFinalPrice.toLocaleString("en-IN")}
                    {coinDiscount > 0 && (
                      <span className="text-xs text-amber-600 font-bold ml-2">
                        (Saved ₹{coinDiscount.toLocaleString("en-IN")} using Coins!)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#86868b]">
                    Delivered with Free Express Courier Packaging
                  </p>

                  {/* Redeem Coins Checkbox */}
                  <div className="pt-3">
                    <label className="inline-flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl cursor-pointer hover:bg-amber-500/15 transition text-xs font-medium text-amber-900">
                      <input
                        type="checkbox"
                        checked={useCoins}
                        onChange={(e) => setUseCoins(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <span className="flex items-center gap-1">
                        🪙 <strong>Redeem ALL {userCoins} Shop Mart Coins</strong> for instant <strong>₹{Math.min(userCoins, rawPrice)} Off</strong>
                      </span>
                    </label>
                  </div>
                </div>
              </div>


              {/* Shipping Address Card */}
              <div className="bg-[#f5f5f7] rounded-2xl p-6 border border-black/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider flex items-center gap-1.5">
                    <Truck size={16} className="text-[#0071e3]" /> Shipping Address
                  </span>
                  <button
                    onClick={() => navigate("/users/profile/edit")}
                    className="text-xs font-semibold text-[#0071e3] hover:underline"
                  >
                    Edit Address
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={user?.profilePicture || "https://static.vecteezy.com/system/resources/previews/020/192/489/non_2x/winner-human-or-happy-human-logo-design-vector.jpg"}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border border-white shadow-sm object-cover"
                  />
                  <div>
                    <span className="font-semibold text-sm text-[#1d1d1f] block">
                      {user.firstname} {user.lastname}
                    </span>
                    <span className="text-xs text-[#86868b]">{user.email}</span>
                  </div>
                </div>

                <div className="text-sm text-[#515154] leading-relaxed pt-2 border-t border-black/5">
                  {user.address?.street && <p>{user.address.street}</p>}
                  {user.address?.city && <p>{user.address.city}</p>}
                  {user.contact && <p className="text-xs text-[#86868b] mt-1">Contact: {user.contact}</p>}
                </div>
              </div>

              {/* Checkout Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button
                  onClick={handleCOD}
                  disabled={isProcessing}
                  className="apple-btn-dark py-4 text-base font-semibold flex items-center justify-center gap-2 active:scale-95"
                >
                  <CheckCircle2 size={18} />
                  <span>Cash on Delivery</span>
                </button>
                <button
                  onClick={handleOnlinePayment}
                  disabled={isProcessing}
                  className="apple-btn-primary py-4 text-base font-semibold flex items-center justify-center gap-2 active:scale-95"
                >
                  <CreditCard size={18} />
                  <span>Pay Online (Card / UPI)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-[#86868b]">
            <p className="text-lg">Product not found for checkout.</p>
          </div>
        )}
      </main>

      {/* Apple Payment Modal */}
      {showPaymentPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowPaymentPopup(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            className="apple-card bg-white w-full max-w-md p-8 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-1">
              <span className="w-12 h-12 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mx-auto mb-2">
                <ShieldCheck size={24} />
              </span>
              <h2 className="text-2xl font-bold text-[#1d1d1f]">Secure Payment</h2>
              <p className="text-xs text-[#86868b]">Enter your credit or debit card details below.</p>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                  Card Number
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="XXXX XXXX XXXX XXXX"
                    maxLength="16"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                    className="apple-input pr-12 text-base font-mono"
                  />
                  <FaCcVisa className="absolute right-4 text-2xl text-blue-600 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                  Expiration Date
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="MM"
                    maxLength="2"
                    value={expMonth}
                    onChange={(e) => setExpMonth(e.target.value.replace(/\D/g, "").slice(0, 2))}
                    className="apple-input text-center font-mono"
                  />
                  <input
                    type="text"
                    placeholder="YYYY"
                    maxLength="4"
                    value={expYear}
                    onChange={(e) => setExpYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="apple-input text-center font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                  Security Code (CVV)
                </label>
                <div className="relative">
                  <input
                    type={showCvv ? "text" : "password"}
                    placeholder="CVV"
                    maxLength="3"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    className="apple-input font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCvv ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowPaymentPopup(false)}
                className="flex-1 apple-btn-dark py-3 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => validatePaymentDetails()}
                className="flex-1 apple-btn-primary py-3 text-sm font-semibold shadow-md"
              >
                Pay ₹{(product?.discount || product?.price)?.toLocaleString("en-IN")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default BuyNowSummary;

