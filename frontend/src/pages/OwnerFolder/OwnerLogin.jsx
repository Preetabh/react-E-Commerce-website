import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShieldCheck, Mail, Lock, ChevronRight, ArrowLeft } from "lucide-react";
import "../../App.css";

const OwnerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        toast.error("Please enter email and password");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/owner/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Admin Authorization Successful!");
        localStorage.setItem("token", response.data.token);
       
        setLoading(false);
        navigate("/owner/dashboard");
      }
    } catch (error) {
      setLoading(false);

      if (error.response) {
        const errorMessage = error.response.data.message;

        if (errorMessage === "User already exists") {
          toast.error("User registered! Please log in.");
        } else if (errorMessage === "Invalid credentials") {
          toast.error("Invalid credentials.");
        } else {
          toast.error("Authentication error.");
        }
      } else {
        toast.error("Network error. Check connection.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f0f11] text-[#f5f5f7] flex flex-col justify-between items-center px-4 py-8 relative font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-5xl flex justify-between items-center">
        <button
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />
          <span>Customer Storefront</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            <ShieldCheck size={16} />
          </div>
          <span className="font-semibold text-sm text-white">Shop Mart Admin</span>
        </div>
      </div>

      <div className="w-full max-w-md my-auto pt-4 pb-8">
        <div className="apple-card-dark p-8 sm:p-10 bg-white/5 border border-white/10 shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
            <ShieldCheck size={28} />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Admin Console Access
            </h1>
            <p className="text-xs text-gray-400">
              Sign in with your verified Administrator credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  placeholder="admin@shopmart.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="apple-input bg-white/5 border-white/10 text-white placeholder-gray-500 pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="apple-input bg-white/5 border-white/10 text-white placeholder-gray-500 pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full apple-btn-primary py-3.5 flex items-center justify-center gap-2 text-sm font-semibold shadow-md active:scale-95 mt-4"
            >
              <span>{loading ? "Authenticating Admin..." : "Sign In to Console"}</span>
              <ChevronRight size={16} />
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-xs text-gray-400">
            Need an Admin Account?{" "}
            <Link to="/owner/register" className="text-blue-400 font-semibold hover:underline">
              Register Administrator
            </Link>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        &copy; {new Date().getFullYear()} Shop Mart Admin Gateway. Secured by End-to-End Encryption.
      </div>
    </div>
  );
};

export default OwnerLogin;
