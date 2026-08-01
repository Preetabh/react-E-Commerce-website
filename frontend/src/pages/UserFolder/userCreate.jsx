import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, User, Mail, Lock, Phone, Apple, ChevronRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import GridScan from "../../components/GridScan.jsx";
import "../../App.css";

const UserCreate = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !email || !contact || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        {
          firstname,
          lastname,
          email,
          contact,
          password,
        }
      );

      if (response.status === 201) {
        toast.success("Account Created Successfully!", { autoClose: 1500 });
        localStorage.setItem("token", response.data.token);

        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(`${error.response.data.message || "Registration failed!"}`);
      } else if (error.request) {
        toast.error("Server not responding. Check your connection.");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const handleGoogleLogin = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:4000";
    window.location.href = `${baseUrl}/auth/google`;
  };

  const handleGithubLogin = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:4000";
    window.location.href = `${baseUrl}/api/auth/github`;
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

      {/* Register Box */}
      <div className="w-full max-w-md my-auto py-6 z-10">
        <div className="apple-card p-6 sm:p-10 bg-white/90 backdrop-blur-2xl text-[#1d1d1f] shadow-2xl space-y-6 text-center border border-white/20">
          <div className="w-14 h-14 rounded-full bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center mx-auto">
            <Apple size={28} className="fill-current" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
              Create Your Shop Mart ID
            </h1>
            <p className="text-xs text-[#86868b]">
              One account for seamless shopping, order tracking, and Genius support.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="apple-input has-icon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="apple-input has-icon"
                  />
                </div>
              </div>
            </div>

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
              <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                Contact Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                <input
                  type="text"
                  placeholder="10-digit Phone Number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="apple-input has-icon"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                Password
              </label>
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
              <span>{loading ? "Creating Account..." : "Create Shop Mart ID"}</span>
              <ChevronRight size={16} />
            </button>
          </form>

          <div className="relative my-3 flex items-center justify-center">
            <div className="border-t border-gray-300/60 w-full"></div>
            <span className="bg-[#f5f5f7] px-3 text-[10px] font-semibold text-gray-500 rounded-full uppercase tracking-wider absolute">
              OR
            </span>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold border border-gray-300/80 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 text-sm active:scale-95 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>

            <button
              type="button"
              onClick={handleGithubLogin}
              className="w-full py-3 px-4 bg-[#24292e] hover:bg-[#1b1f23] text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 text-sm active:scale-95 cursor-pointer"
            >
              <FaGithub size={20} className="text-white" />
              <span>Sign up with GitHub</span>
            </button>
          </div>

          <div className="pt-4 border-t border-black/10 text-xs text-[#86868b]">
            Already have a Shop Mart ID?{" "}
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

export default UserCreate;
