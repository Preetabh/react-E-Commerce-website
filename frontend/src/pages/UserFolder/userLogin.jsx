import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Lock, Mail, Apple, ChevronRight } from "lucide-react";
import GridScan from "../../components/GridScan.jsx";
import "../../App.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Sign In Successful!", { autoClose: 1500 });
        localStorage.setItem("token", response.data.token);

        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(`${error.response.data.message || "Sign In failed!"}`);
      } else if (error.request) {
        toast.error("Server not responding. Check your internet connection.");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070a13] text-[#f5f5f7] flex flex-col justify-between items-center px-4 py-6 overflow-y-auto relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-80">
        <GridScan
          sensitivity={0.3}
          lineThickness={1}
          linesColor="#161b26"
          gridScale={0.12}
          scanColor="#0071e3"
          scanOpacity={0.5}
          enablePost={false}
          scanDuration={3.0}
        />
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header Bar */}
      <div className="w-full max-w-5xl flex justify-between items-center py-2 z-10">

        <button
          className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white transition"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />
          <span>Back to Store</span>
        </button>

        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white text-[#1d1d1f] flex items-center justify-center shadow-md">
            <Apple size={16} className="fill-current" />
          </div>
          <span className="font-semibold text-sm text-white">Shop Mart</span>
        </Link>
      </div>

      {/* Apple ID Container */}
      <div className="w-full max-w-md my-auto py-6 z-10">
        <div className="apple-card p-6 sm:p-10 bg-white/90 backdrop-blur-2xl text-[#1d1d1f] shadow-2xl space-y-6 text-center border border-white/20">




          <div className="w-14 h-14 rounded-full bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center mx-auto">
            <Apple size={28} className="fill-current" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
              Sign in with Shop Mart ID
            </h1>
            <p className="text-xs text-[#86868b]">
              Manage your Bag, Track Orders &amp; Access Genius AI.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="apple-input has-icon"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                  Password
                </label>
                <Link to="/users/forgetPassword" className="text-xs text-[#0071e3] hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="apple-input has-icon"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full apple-btn-primary py-3.5 flex items-center justify-center gap-2 text-sm font-semibold shadow-md active:scale-95 mt-4"
            >
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              <ChevronRight size={16} />
            </button>
          </form>


          <div className="pt-4 border-t border-black/10 text-xs text-[#86868b]">
            Don't have a Shop Mart ID?{" "}
            <Link to="/users/register" className="text-[#0071e3] font-semibold hover:underline">
              Create yours now
            </Link>
          </div>
        </div>
      </div>

      <div className="text-xs text-[#86868b] text-center">
        &copy; {new Date().getFullYear()} Shop Mart Inc. All rights reserved.
      </div>
    </div>
  );
};

export default UserLogin;
