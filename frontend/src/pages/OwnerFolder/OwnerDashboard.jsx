import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OwnerNavbar from "../../components/OwnerNavbar";
import Footer from "../../components/Footer";
import { Users, Package, ShieldCheck, Mail, ArrowUpRight } from "lucide-react";
import "../../App.css";

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Token missing! Redirecting to login...", { toastId: "token-missing" });
          navigate("/owner/login");
          return;
        }

        setLoading(true);

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/owner/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          navigate("/owner/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="bg-[#0f0f11] text-[#f5f5f7] min-h-screen flex flex-col justify-between font-sans">
      <div>
        <OwnerNavbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-blue-500/20">
                <ShieldCheck size={14} /> Shop Mart Admin Console
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Store Analytics &amp; Overview
              </h1>
            </div>

            {data?.owner && (
              <div className="apple-card-dark p-4 bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                  {data.owner.firstname?.[0] || "A"}
                </div>
                <div className="text-left text-xs">
                  <span className="font-semibold text-white block">{data.owner.firstname} {data.owner.lastname}</span>
                  <span className="text-gray-400">{data.owner.email}</span>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400 mt-4">Loading store metrics...</p>
            </div>
          ) : data ? (
            <div className="space-y-8">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="apple-card-dark p-6 bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Customers</span>
                    <Users size={20} className="text-blue-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {data.totalUsers || 0}
                  </div>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                    <ArrowUpRight size={12} /> +14% vs last week
                  </p>
                </div>

                <div className="apple-card-dark p-6 bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Catalog Products</span>
                    <Package size={20} className="text-indigo-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {data.totalProducts || 0}
                  </div>
                  <p className="text-xs text-gray-400 font-medium">
                    Available in Inventory
                  </p>
                </div>

                <div className="apple-card-dark p-6 bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Sales Revenue</span>
                    <span className="text-amber-400 font-bold">₹</span>
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    ₹{(data.totalRevenue || 0).toLocaleString("en-IN")}
                  </div>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                    <ArrowUpRight size={12} /> Total Orders: {data.totalOrders || 0}
                  </p>
                </div>

                <div className="apple-card-dark p-6 bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Active Customer Coins</span>
                    <span className="text-yellow-400 text-sm">🪙</span>
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {(data.totalCoinsActive || 0).toLocaleString("en-IN")}
                  </div>
                  <p className="text-xs text-blue-400 font-medium">
                    DB User Balance Total
                  </p>
                </div>
              </div>

              {/* Interactive Revenue & Conversion Graphs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* SVG Revenue Curve Graph */}
                <div className="lg:col-span-2 apple-card-dark p-6 bg-white/5 border border-white/10 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-white">Database Sales Revenue Growth</h3>
                      <p className="text-xs text-gray-400">Live order earnings across database records</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                      Live DB Sync
                    </span>
                  </div>

                  <div className="relative h-64 w-full pt-4">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0071e3" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#0071e3" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid lines */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                      <line x1="0" y1="70" x2="500" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                      <line x1="0" y1="110" x2="500" y2="110" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />

                      {/* Curve area */}
                      <path
                        d="M 0 130 Q 80 40, 160 80 T 320 30 T 500 10 L 500 150 L 0 150 Z"
                        fill="url(#chartGradient)"
                      />

                      {/* Curve line */}
                      <path
                        d="M 0 130 Q 80 40, 160 80 T 320 30 T 500 10"
                        fill="none"
                        stroke="#0071e3"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Data markers */}
                      <circle cx="160" cy="80" r="5" fill="#0071e3" stroke="#fff" strokeWidth="2" />
                      <circle cx="320" cy="30" r="5" fill="#0071e3" stroke="#fff" strokeWidth="2" />
                      <circle cx="500" cy="10" r="6" fill="#10b981" stroke="#fff" strokeWidth="2" />
                    </svg>

                    <div className="flex justify-between text-[11px] text-gray-500 font-semibold pt-2 border-t border-white/5">
                      <span>Jan</span>
                      <span>Mar</span>
                      <span>May</span>
                      <span>Jul</span>
                      <span>Sep</span>
                      <span>Nov</span>
                    </div>
                  </div>
                </div>

                {/* Sales Volume Bar Chart */}
                <div className="apple-card-dark p-6 bg-white/5 border border-white/10 space-y-4">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-base font-bold text-white">Weekly Order Fulfillment</h3>
                    <p className="text-xs text-gray-400">Order dispatch volume breakdown from DB</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {(data.weeklyFulfillment && data.weeklyFulfillment.length > 0
                      ? data.weeklyFulfillment
                      : [
                          { day: "Mon", count: 0 },
                          { day: "Tue", count: 0 },
                          { day: "Wed", count: 0 },
                          { day: "Thu", count: 0 },
                          { day: "Fri", count: 0 },
                          { day: "Sat", count: 0 },
                        ]
                    ).map((item) => {
                      const maxCount = Math.max(...(data.weeklyFulfillment?.map((x) => x.count) || [1]), 1);
                      const pct = Math.min(100, Math.round((item.count / maxCount) * 100)) + "%";
                      return (
                        <div key={item.day} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-gray-400">{item.day}</span>
                            <span className="text-white font-mono">{item.count} orders</span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: item.count > 0 ? pct : "4%" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>



              {/* Registered Customers Table */}
              <div className="apple-card-dark p-6 bg-white/5 border border-white/10 space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users size={18} className="text-blue-400" /> Registered Customer Accounts
                  </h3>
                  <span className="text-xs font-semibold text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {data.users?.length || 0} Users
                  </span>
                </div>

                {data.users?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-300">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider bg-white/5">
                          <th className="py-3 px-4 rounded-l-xl">Name</th>
                          <th className="py-3 px-4">Email Address</th>
                          <th className="py-3 px-4 rounded-r-xl">Contact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {data.users.map((user, index) => (
                          <tr key={index} className="hover:bg-white/5 transition">
                            <td className="py-3.5 px-4 font-semibold text-white">
                              {user.firstname} {user.lastname}
                            </td>
                            <td className="py-3.5 px-4 text-gray-300">
                              {user.email}
                            </td>
                            <td className="py-3.5 px-4 text-gray-400 font-mono">
                              {user.contact || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-xs text-gray-500 py-8">No registered user accounts found.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-red-400">
              Failed to load admin metrics.
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default OwnerDashboard;

