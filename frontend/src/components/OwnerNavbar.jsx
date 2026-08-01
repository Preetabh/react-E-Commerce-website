import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LayoutDashboard, LogOut, User, Menu, X, PlusCircle, List, ShoppingBag, ShieldCheck } from "lucide-react";

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

      toast.success("Logged out successfully", { autoClose: 2000 });

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
    { path: "/owner/Add-Items", label: "Add Product", icon: PlusCircle },
    { path: "/owner/All-Items", label: "Inventory", icon: List },
    { path: "/owner/AllOrders", label: "Orders", icon: ShoppingBag },
    { path: "/owner/profile", label: "Admin Profile", icon: User },
  ];

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
          <Link to="/owner/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <ShieldCheck size={18} />
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              Shop Mart <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 ml-1">Admin</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1.5">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </Link>
              );
            })}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-red-600 hover:bg-red-50 transition-colors ml-2 border border-red-200/60"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={handlelogin}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-1.5 px-4 rounded-full shadow-sm ml-2"
              >
                Sign In
              </button>
            )}
          </nav>

          <button
            className="md:hidden text-slate-700 hover:text-slate-900 p-2 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              );
            })}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 w-full text-left mt-2 border border-red-200"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handlelogin();
                }}
                className="w-full text-center bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs mt-2"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default OwnerNavbar;
