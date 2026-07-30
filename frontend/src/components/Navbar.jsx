import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Home,
  LogOut,
  ShoppingBag,
  User,
  Menu,
  X,
  Apple,
  Bot,
  PackageCheck,
  Search,
} from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [userCoins, setUserCoins] = useState(250);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data?.coins !== undefined) {
            setUserCoins(res.data.coins);
          }
        })
        .catch((err) => console.log("Navbar profile coins sync:", err.message));
    }
  }, [location]);


  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      localStorage.clear();
      sessionStorage.clear();

      toast.success("Logout Successfully", { autoClose: 2000 });

      setTimeout(() => {
        navigate("/users/logout");
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error("Logout Failed. Try Again!");
      console.error("Logout error:", error.response?.data?.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { path: "/", label: "Store", icon: Home },
    { path: "/users/getCartItems", label: "Bag", icon: ShoppingBag },
    { path: "/users/order", label: "Orders", icon: PackageCheck },
    { path: "/users/helpcenter", label: "Genius AI", icon: Bot },
    { path: "/users/profile", label: "Account", icon: User },
  ];

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Apple Store Top Translucent Header */}
      <header className="fixed top-0 left-0 right-0 z-50 apple-glass transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <Apple size={18} className="fill-current" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-[#1d1d1f]">
              Shop Mart <span className="text-xs font-normal text-[#86868b]">Store</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#1d1d1f] text-white shadow-sm"
                      : "text-[#1d1d1f]/80 hover:text-[#1d1d1f] hover:bg-black/5"
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              );
            })}

            {/* Shop Mart Gold Coins Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-bold text-amber-700 ml-1 shadow-sm" title="Shop Mart Coins (Earn 5% on purchases)">
              <span className="w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-[10px] animate-coin">
                🪙
              </span>
              <span>{userCoins} Coins</span>
            </div>


            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ml-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/users/login"
                className="apple-btn-primary text-sm py-1.5 px-4 ml-2"
              >
                Sign In
              </Link>
            )}
          </nav>


          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#1d1d1f] hover:bg-black/5 transition-colors focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-md z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-[#ffffff] shadow-2xl p-6 transition-transform duration-300 ease-out flex flex-col justify-between ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="flex justify-between items-center pb-6 border-b border-black/10">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center">
                  <Apple size={18} className="fill-current" />
                </div>
                <span className="font-semibold text-lg">Shop Mart</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
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
                        ? "bg-[#1d1d1f] text-white font-semibold shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-black/10">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-base font-medium text-red-600 bg-red-50 hover:bg-red-100 transition"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/users/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-base font-medium bg-[#0071e3] text-white hover:bg-[#0077ed] transition"
              >
                <User size={20} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

