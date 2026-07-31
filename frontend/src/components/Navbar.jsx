import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence, motion } from "framer-motion";
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
  Sparkles,
} from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userCoins, setUserCoins] = useState(250);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      }, 1200);
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

      {/* Floating Auto-Adjusting Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none transition-all duration-500">
        <motion.div
          layout
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className={`pointer-events-auto w-full transition-all duration-500 ease-out border ${
            isScrolled
              ? "max-w-5xl mt-3 py-2 px-5 rounded-full bg-[#0f172a]/95 text-white backdrop-blur-2xl shadow-2xl shadow-slate-950/20 border-slate-800"
              : "max-w-7xl mt-0 sm:mt-2 py-3.5 px-6 rounded-none sm:rounded-3xl bg-[#fcfbf9]/85 text-[#0f172a] backdrop-blur-md shadow-sm border-slate-900/10"
          }`}
        >
          <div className="flex justify-between items-center">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
                  isScrolled
                    ? "bg-white text-[#0f172a]"
                    : "bg-[#0f172a] text-white"
                }`}
              >
                <Apple size={17} className="fill-current" />
              </motion.div>
              <div className="flex flex-col">
                <span
                  className={`text-base font-extrabold tracking-tight leading-none transition-colors ${
                    isScrolled
                      ? "text-white group-hover:text-blue-400"
                      : "text-[#0f172a] group-hover:text-blue-600"
                  }`}
                >
                  Shop Mart
                </span>
                <span
                  className={`text-[10px] font-bold tracking-widest uppercase ${
                    isScrolled ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Luxury Mall
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className={`hidden md:flex items-center space-x-1 relative p-1 rounded-full border transition-colors ${
                isScrolled
                  ? "bg-slate-800/80 border-slate-700/50"
                  : "bg-slate-900/5 border-slate-900/10"
              }`}
            >
              {navLinks.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className="relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 z-10 flex items-center gap-1.5"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavTab"
                        className={`absolute inset-0 rounded-full z-0 shadow-md ${
                          isScrolled ? "bg-blue-600 shadow-blue-600/30" : "bg-[#0f172a]"
                        }`}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 flex items-center gap-1.5 ${
                        isActive
                          ? "text-white"
                          : isScrolled
                          ? "text-slate-300 hover:text-white"
                          : "text-slate-700 hover:text-slate-950"
                      }`}
                    >
                      <Icon size={14} />
                      <span>{label}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls: Coins & Auth */}
            <div className="hidden md:flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs cursor-pointer ${
                  isScrolled
                    ? "bg-amber-400/15 border border-amber-400/30 text-amber-300"
                    : "bg-amber-500/10 border border-amber-500/25 text-amber-800"
                }`}
                title="Shop Mart Coins"
              >
                <span className="w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-[10px] animate-coin">
                  🪙
                </span>
                <span>{userCoins} Coins</span>
              </motion.div>

              {isLoggedIn ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                    isScrolled
                      ? "text-red-400 border-red-500/30 hover:bg-red-950/30"
                      : "text-red-600 border-red-200 hover:bg-red-50"
                  }`}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </motion.button>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/users/login"
                    className="apple-btn-primary text-xs py-1.5 px-4 font-bold shadow-sm inline-flex items-center gap-1"
                  >
                    <span>Sign In</span>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile Navigation Toggle Button */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 rounded-full text-xs font-bold text-amber-800 border border-amber-500/20">
                <span>🪙</span>
                <span>{userCoins}</span>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-full transition-colors focus:outline-none ${
                  isScrolled
                    ? "bg-slate-800 text-white"
                    : "bg-slate-200/80 text-slate-900"
                }`}
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-[#0f172a] text-white shadow-2xl z-50 p-6 flex flex-col justify-between md:hidden border-l border-slate-800"
            >
              <div>
                <div className="flex justify-between items-center pb-5 border-b border-slate-800">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-full bg-white text-[#0f172a] flex items-center justify-center font-bold">
                      <Apple size={18} className="fill-current" />
                    </div>
                    <span className="font-extrabold text-lg text-white">
                      Shop Mart
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full text-slate-400 hover:bg-slate-800"
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
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                            : "text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <Icon size={18} />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-400" />
                    Rewards Balance
                  </span>
                  <span>🪙 {userCoins} Coins</span>
                </div>

                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-bold text-red-400 bg-red-950/40 hover:bg-red-950/60 border border-red-500/30 transition"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <Link
                    to="/users/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-bold bg-blue-600 text-white shadow-lg transition"
                  >
                    <User size={18} />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
