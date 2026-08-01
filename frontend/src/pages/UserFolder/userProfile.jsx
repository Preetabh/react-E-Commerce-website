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
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
