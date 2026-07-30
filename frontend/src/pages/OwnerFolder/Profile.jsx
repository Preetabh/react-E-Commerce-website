/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OwnerNavbar from "../../components/OwnerNavbar";
import Footer from "../../components/Footer";
import { FaCoins } from "react-icons/fa6";
import { PlusCircle, Edit3, ShieldCheck, CreditCard, X } from "lucide-react";
import "../../App.css";

const Profile = () => {
  const [owner, setOwner] = useState(null);
  const [paymentinfo, setPaymentinfo] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/owner/profile`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setOwner(response.data.owner);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/owner/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerProfile();
  }, [navigate]);

  const tooglePaymentInfo = async () => {
    if (paymentinfo) {
      setPaymentinfo(false);
      return;
    }

    try {
      setPaymentLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/orders/paymentInfo`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPaymentData(response.data?.orders || []);
      setPaymentinfo(true);
    } catch (err) {
      console.error("Error fetching payment info:", err.response?.data || err);
    } finally {
      setPaymentLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="bg-[#0f0f11] text-[#f5f5f7] min-h-screen flex flex-col justify-between font-sans">
      <div>
        <OwnerNavbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl">
              <p>{error}</p>
            </div>
          ) : (
            owner && (
              <div className="space-y-8">
                {/* Admin Header Card */}
                <div className="apple-card-dark p-8 sm:p-10 bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center gap-8">
                  <img
                    src={
                      owner?.profilePicture?.startsWith("data:image")
                        ? owner.profilePicture
                        : "https://img.icons8.com/ios7/1200/landlord.jpg"
                    }
                    alt="Admin Avatar"
                    className="w-28 h-28 rounded-full border-2 border-white/10 shadow-lg object-cover"
                  />

                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                      <ShieldCheck size={14} /> Store Owner &amp; Administrator
                    </div>
                    <h1 className="text-3xl font-bold text-white">
                      {owner.firstname} {owner.lastname}
                    </h1>
                    <p className="text-xs text-gray-400">{owner.email} • {owner.contact}</p>

                    <div className="pt-2">
                      <button onClick={tooglePaymentInfo} className="inline-flex items-center gap-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-2xl transition">
                        <FaCoins size={20} className="text-amber-400" />
                        <div className="text-left leading-tight">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Wallet Balance</span>
                          <span className="text-lg font-bold text-white">₹ {(owner.balance || 0).toLocaleString("en-IN")}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Action Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate("/owner/Add-Items")}
                    className="apple-btn-primary py-4 text-sm font-semibold flex items-center justify-center gap-2 shadow-md active:scale-95"
                  >
                    <PlusCircle size={18} />
                    <span>Add New Product Entry</span>
                  </button>

                  <button
                    onClick={() => navigate("/owner/editProfile")}
                    className="py-4 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center gap-2 border border-white/10 active:scale-95"
                  >
                    <Edit3 size={18} />
                    <span>Edit Admin Account</span>
                  </button>
                </div>
              </div>
            )
          )}
        </main>
      </div>

      {/* Payment Information Modal */}
      {paymentinfo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="apple-card-dark bg-[#1d1d1f] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-lg">
                <CreditCard size={20} />
                <span>Store Revenue &amp; Transactions</span>
              </div>
              <button onClick={tooglePaymentInfo} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-x-auto max-h-[50vh]">
              {paymentLoading ? (
                <div className="text-center py-10 text-xs text-gray-400">Loading ledger records...</div>
              ) : paymentData.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-400">No payment transaction records found.</div>
              ) : (
                <table className="w-full text-left text-xs text-gray-300">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider bg-white/5">
                      <th className="py-2.5 px-3">Txn ID</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paymentData.map((order) => (
                      <tr key={order._id}>
                        <td className="py-2.5 px-3 font-mono text-gray-400">{order.transactionId || order._id?.slice(-8)}</td>
                        <td className="py-2.5 px-3 font-bold text-white">₹{order.amount}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {order.paymentStatus || "Success"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-gray-400">{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={tooglePaymentInfo} className="apple-btn-dark py-2 px-6 text-xs font-semibold">
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;

