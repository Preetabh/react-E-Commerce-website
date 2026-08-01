import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Lanyard from "../../components/Lanyard";
import { ArrowLeft, Edit2, Package } from "lucide-react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "../../App.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Toastify({
            text: `Please sign in to access your Account.`,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: { background: "#0f172a", color: "#fff", borderRadius: "12px" },
          }).showToast();
          return navigate('/users/login');
        }
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setUser(response.data || {});
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          navigate("/users/login");
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="bg-[#fcfbf9] min-h-screen text-[#0f172a]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Shop Mart ID Account
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Manage your personal profile information, coins, and order preferences.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 animate-pulse space-y-6">
            <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto sm:mx-0"></div>
            <div className="h-6 bg-slate-100 w-1/3 rounded-lg"></div>
            <div className="h-4 bg-slate-100 w-1/2 rounded-lg"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ReactBits 3D Interactive Lanyard Component */}
            <Lanyard
              position={[0, 0, 30]}
              gravity={[0, -40, 0]}
              fov={20}
              transparent={true}
              imageFit="cover"
              lanyardWidth={1}
              userName={`${user?.firstname || "Shop Mart"} ${user?.lastname || "Member"}`}
              userRole="VERIFIED VIP MEMBER"
              userEmail={user?.email || "user@shopmart.com"}
              userContact={user?.contact || "+91 9876543210"}
              userBalance={user?.coins ?? 250}
              isOwner={false}
              onBalanceClick={() => navigate("/users/Order")}
            />

            {/* Quick Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => navigate("/users/profile/edit")}
                className="bg-slate-900 hover:bg-slate-800 text-white py-3.5 text-xs font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <Edit2 size={16} />
                <span>Edit Profile Details</span>
              </button>

              <button
                onClick={() => navigate("/users/Order")}
                className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 py-3.5 text-xs font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
              >
                <Package size={16} />
                <span>My Order History</span>
              </button>
            </div>

            {/* 🪙 Shop Mart Loyalty Rewards & Coins Center */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-amber-500/20 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xl shadow-sm animate-coin">
                    🪙
                  </div>
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-amber-700 uppercase">VIP Loyalty Rewards</span>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">
                      {user?.coins ?? 250} <span className="text-sm font-bold text-slate-600">Shop Mart Coins</span>
                    </h3>
                  </div>
                </div>

                <div className="bg-amber-400 text-amber-950 px-4 py-2 rounded-2xl font-extrabold text-xs shadow-xs text-center">
                  Redeem Value: ₹{user?.coins ?? 250} Off
                </div>
              </div>

              {/* Coin Offers & Perks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-white p-3.5 rounded-2xl border border-amber-500/20 text-center space-y-1">
                  <span className="text-base block">⚡</span>
                  <div className="text-xs font-bold text-slate-900">100% Coin Redeem</div>
                  <div className="text-[10px] text-slate-500 font-medium">Use ALL coins on any order at checkout</div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-amber-500/20 text-center space-y-1">
                  <span className="text-base block">🎁</span>
                  <div className="text-xs font-bold text-slate-900">5% Order Cashback</div>
                  <div className="text-[10px] text-slate-500 font-medium">Earn 5% back in coins on every purchase</div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-amber-500/20 text-center space-y-1">
                  <span className="text-base block">🚀</span>
                  <div className="text-xs font-bold text-slate-900">Zero Minimum</div>
                  <div className="text-[10px] text-slate-500 font-medium">No minimum cart amount required</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
