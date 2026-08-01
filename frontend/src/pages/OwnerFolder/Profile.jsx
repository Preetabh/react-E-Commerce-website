/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OwnerNavbar from "../../components/OwnerNavbar";
import Footer from "../../components/Footer";
import Lanyard from "../../components/Lanyard";
import { PlusCircle, Edit3, CreditCard, X } from "lucide-react";
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
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen flex flex-col justify-between font-sans">
      <div>
        <OwnerNavbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
              <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-semibold">
              <p>{error}</p>
            </div>
          ) : (
            owner && (
              <div className="space-y-6">
                {/* ReactBits 3D Physics Lanyard Pass Card */}
                <Lanyard
                  position={[0, 0, 30]}
                  gravity={[0, -40, 0]}
                  fov={20}
                  transparent={true}
                  imageFit="cover"
                  lanyardWidth={1}
                  userName={`${owner.firstname} ${owner.lastname}`}
                  userRole="STORE OWNER & ADMINISTRATOR"
                  userEmail={owner.email}
                  userContact={owner.contact || "+91 9876543210"}
                  userBalance={owner.balance || 0}
                  isOwner={true}
                  onBalanceClick={tooglePaymentInfo}
                />

                {/* Quick Action Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                  <button
                    onClick={() => navigate("/owner/Add-Items")}
                    className="bg-slate-900 hover:bg-slate-800 text-white py-3.5 text-xs font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                  >
                    <PlusCircle size={16} />
                    <span>Add New Product Entry</span>
                  </button>

                  <button
                    onClick={() => navigate("/owner/editProfile")}
                    className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 py-3.5 text-xs font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
                  >
                    <Edit3 size={16} />
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-lg">
                <CreditCard size={20} />
                <span>Store Revenue &amp; Transactions</span>
              </div>
              <button onClick={tooglePaymentInfo} className="text-slate-400 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-x-auto max-h-[50vh]">
              {paymentLoading ? (
                <div className="text-center py-10 text-xs text-slate-500 font-semibold">Loading ledger records...</div>
              ) : paymentData.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400 font-medium">No payment transaction records found.</div>
              ) : (
                <table className="w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider bg-slate-50">
                      <th className="py-2.5 px-3">Txn ID</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paymentData.map((order) => (
                      <tr key={order._id}>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{order.transactionId || order._id?.slice(-8)}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">₹{order.amount}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {order.paymentStatus || "Success"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={tooglePaymentInfo} className="bg-slate-900 text-white font-bold py-2 px-6 rounded-xl text-xs shadow-xs">
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
