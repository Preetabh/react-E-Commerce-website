import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ArrowLeft, Mail, Phone, User, Edit2, Package, ShieldCheck, MapPin, Apple } from "lucide-react";
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
            style: { background: "#1d1d1f", color: "#fff", borderRadius: "12px" },
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
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
              Shop Mart ID Account
            </h1>
            <p className="text-sm text-[#86868b] mt-1">
              Manage your personal information, address preferences, and security settings.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {loading ? (
          <div className="apple-card p-12 bg-white animate-pulse space-y-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto sm:mx-0"></div>
            <div className="h-6 bg-gray-200 w-1/3 rounded-lg"></div>
            <div className="h-4 bg-gray-200 w-1/2 rounded-lg"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Account Card */}
            <div className="apple-card p-8 sm:p-10 bg-white flex flex-col sm:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-black/5 shadow-md bg-[#f5f5f7] flex items-center justify-center">
                  <img
                    src={user?.profilePicture || "https://static.vecteezy.com/system/resources/previews/020/192/489/non_2x/winner-human-or-happy-human-logo-design-vector.jpg"}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#0071e3] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                  <ShieldCheck size={14} /> Verified Member
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f]">
                  {user?.firstname || "User"} {user?.lastname || ""}
                </h2>
                <p className="text-sm text-[#86868b]">{user?.email || "No email provided"}</p>

                {/* Shop Mart Coins Badge Card */}
                <div className="pt-1">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs font-bold text-amber-900 shadow-sm">
                    <span className="text-base animate-coin">🪙</span>
                    <span>Shop Mart Coins Balance: <strong>{user?.coins ?? 250} Coins</strong></span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-3 justify-center sm:justify-start">

                  <button
                    onClick={() => navigate("/users/profile/edit")}
                    className="apple-btn-primary py-2 px-5 text-sm flex items-center gap-2"
                  >
                    <Edit2 size={16} />
                    <span>Edit Profile Details</span>
                  </button>

                  <button
                    onClick={() => navigate("/users/Order")}
                    className="apple-btn-dark py-2 px-5 text-sm flex items-center gap-2"
                  >
                    <Package size={16} />
                    <span>My Order History</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Personal Details Grid */}
            <div className="apple-card p-8 bg-white space-y-6">
              <h3 className="text-xl font-bold text-[#1d1d1f] border-b border-black/5 pb-4">
                Personal &amp; Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ProfileDetail icon={User} label="First Name" value={user?.firstname} />
                <ProfileDetail icon={User} label="Last Name" value={user?.lastname} />
                <ProfileDetail icon={Mail} label="Email Address" value={user?.email} />
                <ProfileDetail icon={Phone} label="Contact Phone" value={user?.contact} />
                <ProfileDetail
                  icon={MapPin}
                  label="Shipping Address"
                  value={
                    typeof user?.address === "string"
                      ? user.address
                      : user?.address?.city
                      ? `${user.address.street || ""}, ${user.address.city}`
                      : "No address added yet"
                  }
                  fullWidth
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

const ProfileDetail = ({ icon: Icon, label, value, fullWidth }) => (
  <div className={`p-4 bg-[#f5f5f7] rounded-2xl border border-black/5 flex items-start gap-4 ${fullWidth ? 'sm:col-span-2' : ''}`}>
    <div className="p-2.5 bg-white text-[#0071e3] rounded-xl shadow-sm">
      <Icon size={20} />
    </div>
    <div>
      <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block">{label}</span>
      <span className="text-base font-semibold text-[#1d1d1f] mt-0.5 block">{value || "N/A"}</span>
    </div>
  </div>
);

export default Profile;

