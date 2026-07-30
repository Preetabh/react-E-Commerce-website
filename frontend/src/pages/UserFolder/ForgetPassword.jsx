import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Mail, Lock, Key, Apple, ChevronRight } from "lucide-react";
import "../../App.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const otpGenerate = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }
    setOtpTimer(120);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/send-otp`,
        { email }
      );
      if (response.status === 200) {
        toast.success("Verification code sent to your email.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(`${error.response.data.message || "Request failed!"}`);
      } else {
        toast.error("Server not responding.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !newpassword || !otp) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/reset-password`,
        { email, otp, newpassword }
      );

      if (response.status === 200) {
        toast.success("Password reset successful!");
        setEmail("");
        setOtp("");
        setNewpassword("");
        setTimeout(() => {
          setLoading(false);
          navigate("/users/login");
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(`${error.response.data.message || "Request failed!"}`);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f5f7] text-[#1d1d1f] flex flex-col justify-between items-center px-4 py-8 relative font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center">
        <button
          className="flex items-center gap-2 text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] transition"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />
          <span>Back to Store</span>
        </button>

        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center">
            <Apple size={16} className="fill-current" />
          </div>
          <span className="font-semibold text-sm">Shop Mart</span>
        </Link>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md my-auto pt-4 pb-8">
        <div className="apple-card p-8 sm:p-10 bg-white shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center mx-auto">
            <Key size={26} />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
              Reset Shop Mart ID Password
            </h1>
            <p className="text-xs text-[#86868b]">
              Enter your email to receive an authorization code.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="apple-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newpassword}
                  onChange={(e) => setNewpassword(e.target.value)}
                  className="apple-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                Security OTP Code
              </label>
              <div className="relative flex items-center">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="4-digit OTP"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="apple-input pl-10 pr-28 font-mono tracking-widest text-center"
                />
                <button
                  type="button"
                  onClick={otpGenerate}
                  disabled={otpTimer > 0}
                  className="absolute right-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-black/5 text-[#0071e3] disabled:text-gray-400 disabled:bg-transparent"
                >
                  {otpTimer > 0 ? `${otpTimer}s` : "Get Code"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full apple-btn-primary py-3.5 flex items-center justify-center gap-2 text-sm font-semibold shadow-md active:scale-95 mt-4"
            >
              <span>{loading ? "Resetting..." : "Set New Password"}</span>
              <ChevronRight size={16} />
            </button>
          </form>

          <div className="pt-4 border-t border-black/10 text-xs text-[#86868b]">
            Remembered your credentials?{" "}
            <Link to="/users/login" className="text-[#0071e3] font-semibold hover:underline">
              Sign In
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

export default ForgetPassword;

