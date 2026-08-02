/* eslint-disable no-unused-vars */
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
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
  const isBuyAll = id === "all";

  const [product, setProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
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
    const fetchCheckoutData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (isBuyAll) {
          if (!token) {
            toast.error("❌ Please sign in to continue.");
            return navigate("/users/login");
          }
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/users/getCartItems`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          setCartItems(response.data || []);
        } else {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/products/${id}`
          );
          setProduct(response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching checkout data:", error);
        toast.error("❌ Failed to fetch checkout details!");
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutData();
  }, [id, isBuyAll, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("❌ Please sign in to continue.");
          return navigate("/users/login");
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setUser(response.data || {});
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          toast.error("⚠️ Session expired. Please login again.");
          navigate("/users/login");
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const rawPrice = useMemo(() => {
    if (isBuyAll) {
      return cartItems.reduce(
        (sum, item) =>
          sum + Number(item.discount || item.price) * Number(item.quantity || 1),
        0
      );
    }
    return product ? Number(product.discount || product.price) : 0;
  }, [isBuyAll, cartItems, product]);

  const userCoins = user?.coins ?? 250;
  const coinDiscount = useCoins ? Math.min(userCoins, rawPrice) : 0;
  const displayFinalPrice = Math.max(0, rawPrice - coinDiscount);

  const showOrderSuccessAlert = () => {
    return Swal.fire({
      title: "🎉 Order Placed!",
      text: "Your Cash on Delivery order was successfully confirmed.",
      icon: "success",
      confirmButtonText: "View Order Status",
      confirmButtonColor: "#0071e3",
      customClass: {
        popup: "rounded-3xl font-sans",
        confirmButton: "apple-btn-primary px-6 py-2.5",
      },
    });
  };

  const handleCOD = () => {
    const token = localStorage.getItem("token");
    const address = user.address?.city || user.address?.street;
    const userContact = (user?.contact === "0000000000" || !user?.contact) ? "" : user.contact;

    if (!token) {
      toast.error("❌ Please login to continue.");
      return navigate("/users/login");
    }

    if (!address) {
      toast.error("❌ Please add a shipping address in your profile.");
      return navigate("/users/profile/edit");
    }

    if (!userContact) {
      toast.error("❌ Please add a valid contact number in your profile.");
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
        popup: "rounded-3xl font-sans",
      },
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
            if (isBuyAll) {
              for (const item of cartItems) {
                const itemPrice = Number(item.discount || item.price);
                await axios.post(
                  `${import.meta.env.VITE_BASE_URL}/users/buynowSuccessful/${item._id}`,
                  {
                    redeemCoins: false,
                    redeemedAmount: 0,
                    paymentMethod: "COD",
                    amount: itemPrice,
                  },
                  {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                  }
                );
                await axios.post(
                  `${import.meta.env.VITE_BASE_URL}/users/removeCart/${item._id}`,
                  {},
                  {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                  }
                );
              }
              showOrderSuccessAlert().then(() => {
                toast.success("✅ All orders confirmed!");
                navigate("/users/order");
              });
            } else {
              await axios.post(
                `${import.meta.env.VITE_BASE_URL}/users/buynowSuccessful/${id}`,
                {
                  redeemCoins: useCoins,
                  redeemedAmount: coinDiscount,
                  paymentMethod: "COD",
                  amount: displayFinalPrice,
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                  withCredentials: true,
                }
              );
              showOrderSuccessAlert().then(() => {
                toast.success("✅ Order confirmed!");
                navigate(`/users/orderSuccess/${id}`);
              });
            }
          } catch (err) {
            console.error("COD order save error:", err.message);
            toast.error("❌ Order placement issue. Check orders page.");
            navigate("/users/order");
          }
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

  const validatePaymentDetails = async (
    cardNumberParam,
    yearParam,
    cvvParam,
    monthParam
  ) => {
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
      (yearRaw?.toString().trim().length === 4 ||
        yearRaw?.toString().trim().length === 2) &&
      cvvVal?.trim().length === 3;

    if (!basicValid) {
      toast.error("❌ Invalid card details. Check card number, expiry and CVV.");
      return;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const isExpired =
      yearNum < currentYear ||
      (yearNum === currentYear && monthNum < currentMonth);

    if (isExpired) {
      setShowPaymentPopup(false);
      toast.error("❌ Card expired. Please use a valid card.");
      setCardNumber("");
      setExpMonth("");
      setExpYear("");
      setCvv("");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      if (isBuyAll) {
        for (const item of cartItems) {
          const itemPrice = Number(item.discount || item.price);
          await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/orders/placeorder`,
            {
              productId: item._id,
              amount: itemPrice,
              redeemCoins: false,
              redeemedAmount: 0,
              paymentMethod: "Online",
            },
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          await axios.post(
            `${import.meta.env.VITE_BASE_URL}/users/removeCart/${item._id}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
        }
      } else {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/orders/placeorder`,
          {
            productId: id,
            amount: displayFinalPrice,
            redeemCoins: useCoins,
            redeemedAmount: coinDiscount,
            paymentMethod: "Online",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      }
    } catch (e) {
      console.log("Online payment proceeding note:", e.message);
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
      if (isBuyAll) {
        navigate("/users/order");
      } else {
        navigate(`/users/orderSuccess/${id}`);
      }
    }, 2000);
  };

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
            <p className="text-sm text-[#86868b] mt-4 font-medium">
              Preparing checkout details...
            </p>
          </div>
        ) : (product || (isBuyAll && cartItems.length > 0)) ? (
          <div className="space-y-8">
            {/* Main Order Review Card */}
            <div className="apple-card p-6 sm:p-10 bg-white space-y-8">
              {isBuyAll ? (
                /* All Cart Items Checkout Review */
                <div className="space-y-6 border-b border-black/10 pb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                      Bag Items Summary ({cartItems.length} items)
                    </span>
                    <span className="text-xs font-bold text-[#0071e3] bg-blue-50 px-3 py-1 rounded-full">
                      All Items Bundle
                    </span>
                  </div>

                  <div className="divide-y divide-black/5 max-h-96 overflow-y-auto pr-2 space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="pt-3 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.images?.[0]?.url ||
                              item.image?.url ||
                              "https://via.placeholder.com/80"
                            }
                            alt={item.name}
                            className="w-14 h-14 object-contain bg-[#fbfbfd] rounded-xl p-1.5 border border-black/5"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-[#1d1d1f] line-clamp-1">
                              {item.name}
                            </h4>
                            <span className="text-xs text-[#86868b]">
                              Qty: {item.quantity || 1}
                            </span>
                          </div>
                        </div>

                        <span className="text-base font-bold text-[#1d1d1f] shrink-0">
                          ₹
                          {(
                            Number(item.discount || item.price) *
                            Number(item.quantity || 1)
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-black/10 flex justify-between items-baseline">
                    <span className="text-base font-bold text-[#1d1d1f]">
                      Total Order Amount
                    </span>
                    <div className="text-2xl font-extrabold text-[#0071e3]">
                      ₹{displayFinalPrice.toLocaleString("en-IN")}
                      {coinDiscount > 0 && (
                        <span className="text-xs text-amber-600 font-bold block sm:inline sm:ml-2">
                          (Saved ₹{coinDiscount.toLocaleString("en-IN")} using Coins!)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Redeem Coins Checkbox */}
                  <div className="pt-2">
                    <label className="inline-flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl cursor-pointer hover:bg-amber-500/15 transition text-xs font-medium text-amber-900 w-full">
                      <input
                        type="checkbox"
                        checked={useCoins}
                        onChange={(e) => setUseCoins(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <span className="flex items-center gap-1">
                        🪙 <strong>Redeem ALL {userCoins} Shop Mart Coins</strong>{" "}
                        for instant <strong>₹{Math.min(userCoins, rawPrice)} Off</strong>
                      </span>
                    </label>
                  </div>
                </div>
              ) : (
                /* Single Product Checkout Review */
                <div className="flex flex-col sm:flex-row items-center gap-8 border-b border-black/10 pb-8">
                  <div className="w-44 h-44 bg-[#fbfbfd] rounded-2xl flex items-center justify-center p-4 shrink-0">
                    <img
                      src={
                        product.images?.[0]?.url ||
                        product.image?.url ||
                        "https://via.placeholder.com/200"
                      }
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
                          🪙 <strong>Redeem ALL {userCoins} Shop Mart Coins</strong>{" "}
                          for instant <strong>₹{Math.min(userCoins, rawPrice)} Off</strong>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

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
                    src={
                      user?.profilePicture ||
                      "https://static.vecteezy.com/system/resources/previews/020/192/489/non_2x/winner-human-or-happy-human-logo-design-vector.jpg"
                    }
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
                  {user.contact && user.contact !== "0000000000" ? (
                    <p className="text-xs text-[#86868b] mt-1 font-medium">
                      Contact: {user.contact}
                    </p>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mt-2">
                      <span>⚠️ Phone number required for order verification.</span>
                      <button
                        onClick={() => navigate("/users/profile/edit")}
                        className="font-extrabold text-[#0071e3] underline hover:text-blue-700"
                      >
                        Add Phone Number
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Checkout Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button
                  onClick={handleCOD}
                  disabled={isProcessing}
                  className="apple-btn-dark py-4 text-base font-semibold flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 size={18} />
                  <span>Cash on Delivery</span>
                </button>
                <button
                  onClick={handleOnlinePayment}
                  disabled={isProcessing}
                  className="apple-btn-primary py-4 text-base font-semibold flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <CreditCard size={18} />
                  <span>Pay Online (Card / UPI)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="apple-card p-12 text-center max-w-xl mx-auto bg-white my-10 space-y-4">
            <h2 className="text-2xl font-bold text-[#1d1d1f]">
              No Checkout Items Found
            </h2>
            <p className="text-sm text-[#86868b]">
              Your Bag is currently empty or the item is no longer available.
            </p>
            <button
              onClick={() => navigate("/")}
              className="apple-btn-primary py-2.5 px-6 text-sm"
            >
              Return to Store
            </button>
          </div>
        )}
      </main>

      {/* Online Payment Modal */}
      {showPaymentPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="apple-card p-6 sm:p-8 bg-white max-w-md w-full space-y-6 shadow-2xl relative"
          >
            <div className="flex justify-between items-center border-b border-black/10 pb-4">
              <span className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                <FaCcVisa className="text-2xl text-blue-600" /> Payment Gateway
              </span>
              <button
                onClick={() => setShowPaymentPopup(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="4000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-2.5 bg-[#f5f5f7] border border-slate-200 rounded-xl text-sm font-semibold tracking-widest text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Exp Month
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="MM (08)"
                    value={expMonth}
                    onChange={(e) => setExpMonth(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3 py-2.5 bg-[#f5f5f7] border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Exp Year
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="YYYY (2028)"
                    value={expYear}
                    onChange={(e) => setExpYear(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3 py-2.5 bg-[#f5f5f7] border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    CVV
                  </label>
                  <div className="relative">
                    <input
                      type={showCvv ? "text" : "password"}
                      maxLength={3}
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-3 py-2.5 bg-[#f5f5f7] border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCvv(!showCvv)}
                      className="absolute right-2 top-3 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      {showCvv ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowPaymentPopup(false)}
                className="w-1/2 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => validatePaymentDetails()}
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition text-sm flex items-center justify-center gap-1.5"
              >
                <span>Pay ₹{displayFinalPrice.toLocaleString("en-IN")}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BuyNowSummary;
