import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LayoutDashboard, LogOut, User, Menu, X, PlusCircle, List, ShoppingBag, ShieldCheck, Apple } from "lucide-react";

const OwnerNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/users/logout`, {}, { withCredentials: true });
      Cookies.remove("token");
      localStorage.clear();
      sessionStorage.clear();

      toast.success("Logout Successfully", { autoClose: 2000 });

      setTimeout(() => {
        navigate("/owner/login");
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error("Logout Failed. Try Again!");
      console.error("Logout error:", error.response?.data?.message);
    }
  };

  const handlelogin = () => {
    navigate("/owner/login");
  };

  const navLinks = [
    { path: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/owner/Add-Items", label: "Add Item", icon: PlusCircle },
    { path: "/owner/All-Items", label: "Inventory", icon: List },
    { path: "/owner/AllOrders", label: "Orders", icon: ShoppingBag },
    { path: "/owner/profile", label: "Admin Profile", icon: User },
  ];

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <header className="fixed top-0 left-0 right-0 z-50 apple-glass-dark transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
          <Link to="/owner/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-white text-[#1d1d1f] flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <ShieldCheck size={18} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              Shop Mart <span className="text-xs font-normal text-gray-400">Admin</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#1d1d1f] shadow-sm font-semibold"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              );
            })}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors ml-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={handlelogin}
                className="apple-btn-primary text-sm py-1.5 px-4 ml-2"
              >
                Sign In
              </button>
            )}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-white hover:bg-white/10 transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-[#1c1c1e] text-white shadow-2xl p-6 transition-transform duration-300 ease-out flex flex-col justify-between ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="flex justify-between items-center pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
                <span className="font-semibold text-lg text-white">Owner Portal</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-2 mt-6">
              {navLinks.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium transition-all ${
                      isActive
                        ? "bg-white text-[#1d1d1f] font-semibold shadow-md"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-white/10">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-base font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handlelogin();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-base font-medium bg-[#0071e3] text-white hover:bg-[#0077ed] transition"
              >
                <User size={20} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerNavbar;

