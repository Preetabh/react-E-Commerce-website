import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Mail, Lock, Phone, User, Apple, ArrowLeft, ChevronRight } from "lucide-react";
import GridScan from "../../components/GridScan.jsx";
import "../../App.css";

const UserCreate = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidContact = (contact) => /^[0-9]{10}$/.test(contact);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !email || !password || !contact) {
      toast.error("Please fill all fields");
      return;
    }
    if (password.length < 4) {
      toast.error("Password must be at least 4 characters long");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!isValidContact(contact)) {
      toast.error("Please enter a valid 10-digit contact number");
      return;
    }

    setLoading(true);

    try {
      const userData = { firstname, lastname, email, password, contact };
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        userData
      );

      if (response.status === 201) {
        toast.success("Account created successfully!", { autoClose: 1500 });
        setTimeout(() => {
          setFirstname("");
          setLastname("");
          setEmail("");
          setPassword("");
          setContact("");
          setLoading(false);
          navigate("/users/login");
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      toast.error("Registration failed. Please try again.");
      setLoading(false);
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
          scanColor="#8b5cf6"
          scanOpacity={0.5}
          enablePost={false}
          scanDuration={3.0}
        />
      </div>

      <ToastContainer position="top-right" autoClose={3000} />



      {/* Header */}
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

      {/* Form Container */}
      <div className="w-full max-w-lg my-auto py-6 z-10">
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
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                <input
                  type="password"
                  placeholder="At least 4 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="apple-input has-icon"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                Contact Phone
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

            <button
              type="submit"
              disabled={loading}
              className="w-full apple-btn-primary py-3.5 flex items-center justify-center gap-2 text-sm font-semibold shadow-md active:scale-95 mt-4"
            >
              <span>{loading ? "Creating Account..." : "Create Shop Mart ID"}</span>
              <ChevronRight size={16} />
            </button>
          </form>


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

