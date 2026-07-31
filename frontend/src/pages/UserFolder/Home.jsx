/* eslint-disable no-unused-vars */
import Lenis from "@studio-freight/lenis";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  PackageX,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  FaCamera,
  FaClock,
  FaHeadphones,
  FaLaptop,
  FaLayerGroup,
  FaMobileAlt,
  FaTv,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "../../App.css";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const navigate = useNavigate();

  const banners = [
    {
      title: "Store. The best way to buy the tech you love.",
      subtitle: "Discover flagship performance, studio acoustics, and timeless minimalist luxury design.",
      tag: "FLAGSHIP SELECTION",
      highlight: "Save up to ₹4,500 today",
    },
    {
      title: "Pro performance. Clean minimalist aesthetic.",
      subtitle: "Unmatched clarity and next-gen hardware crafted for effortless everyday excellence.",
      tag: "NEW ARRIVALS",
      highlight: "0% Interest EMI Available",
    },
    {
      title: "Designed to amaze. Built to last.",
      subtitle: "Enjoy up to 30% off on flagship models with instant express delivery to your doorstep.",
      tag: "LIMITED EDITION",
      highlight: "Free Express Shipping",
    },
  ];

  const bannersImage = [
    {
      image:
        "https://i.ibb.co/N6qJGLBg/wireless-earbuds-with-neon-cyberpunk-style-lighting-2-removebg-preview.png",
    },
    {
      image:
        "https://i.ibb.co/mrGH4zrF/wireless-earbuds-with-neon-cyberpunk-style-lighting.png",
    },
    {
      image:
        "https://i.ibb.co/fY2pc8c1/LS20250730225719.png",
    },
  ];

  const categoryList = [
    { label: "All Items", value: "", icon: <FaLayerGroup /> },
    { label: "Phones", value: "electronics", icon: <FaMobileAlt /> },
    { label: "TVs", value: "tv", icon: <FaTv /> },
    { label: "Monitors", value: "monitor", icon: <FaLaptop /> },
    { label: "Watches", value: "watch", icon: <FaClock /> },
    { label: "Headphones", value: "headphones", icon: <FaHeadphones /> },
    { label: "Cameras", value: "camera", icon: <FaCamera /> },
  ];

  useEffect(() => {
    const lenis = new Lenis({ smooth: true, lerp: 0.08 });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/products`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const addToCart = async (productId, productName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Toastify({
          text: `Please sign in to add items to your Bag.`,
          duration: 3000,
          gravity: "top",
          position: "right",
          style: {
            background: "#0f172a",
            color: "#fff",
            borderRadius: "12px",
            fontWeight: "700",
            boxShadow: "0 10px 25px rgba(15,23,42,0.25)",
          },
        }).showToast();
        return navigate("/users/login");
      }

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/addtocart`,
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      Toastify({
        text: `🛒 ${productName} added to Bag`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "700",
          boxShadow: "0 10px 25px rgba(37,99,235,0.35)",
        },
      }).showToast();
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      Toastify({
        text: "❌ Could not add product to Bag",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "#dc2626",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "700",
        },
      }).showToast();
    }
  };

  const categoryCounts = useMemo(() => {
    const counts = { "": products.length };
    products.forEach((p) => {
      if (p.category) {
        const catLower = p.category.toLowerCase();
        categoryList.forEach((c) => {
          if (c.value && catLower.includes(c.value)) {
            counts[c.value] = (counts[c.value] || 0) + 1;
          }
        });
      }
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((product) =>
        selectedCategory === ""
          ? true
          : product.category &&
            product.category.toLowerCase().includes(selectedCategory)
      );

    if (sortBy === "price-low") {
      result = [...result].sort(
        (a, b) => (a.discount || a.price) - (b.discount || b.price)
      );
    } else if (sortBy === "price-high") {
      result = [...result].sort(
        (a, b) => (b.discount || b.price) - (a.discount || a.price)
      );
    } else if (sortBy === "discount") {
      result = [...result].sort((a, b) => {
        const savingsA =
          a.discount && a.price > a.discount ? a.price - a.discount : 0;
        const savingsB =
          b.discount && b.price > b.discount ? b.price - b.discount : 0;
        return savingsB - savingsA;
      });
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const renderProductCard = (product) => {
    const hasDiscount = product.discount && product.price > product.discount;
    const discountAmt = hasDiscount ? product.price - product.discount : 0;
    const discountPercent = hasDiscount
      ? Math.round(((product.price - product.discount) / product.price) * 100)
      : 0;

    return (
      <motion.div
        key={product._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="premium-card-border group flex flex-col justify-between p-5 rounded-3xl transition-all duration-300 relative overflow-hidden"
      >
        <div className="block flex-1">
          {/* Top Tag Badges */}
          <div className="flex items-center justify-between gap-2 mb-3">
            {hasDiscount ? (
              <span className="bg-[#0f172a] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                Save ₹{discountAmt.toLocaleString("en-IN")} ({discountPercent}% OFF)
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {product.category || "Gadget"}
              </span>
            )}

            <button
              onClick={() => setQuickViewProduct(product)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Quick View"
            >
              <Eye size={17} />
            </button>
          </div>

          {/* Product Image Container */}
          <Link to={`/products/${product._id}`} className="block">
            <div className="relative h-52 w-full flex items-center justify-center p-4 mb-4 bg-[#f4f3ef] rounded-2xl group-hover:bg-[#ebe9e3] transition-all duration-300">
              <img
                src={
                  product.images?.[0]?.url ||
                  product.image?.url ||
                  "https://via.placeholder.com/200"
                }
                alt={product.name}
                loading="lazy"
                className="max-h-44 max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/200";
                  e.target.onerror = null;
                }}
              />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
                {product.category || "Flagship Model"}
              </span>
              <h3 className="text-base font-bold text-[#0f172a] group-hover:text-blue-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-lg font-extrabold text-[#0f172a]">
                    ₹{product.discount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-slate-400 line-through font-semibold">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                </>
              ) : (
                <span className="text-lg font-extrabold text-[#0f172a]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-5 gap-2">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="col-span-1 border border-slate-200 text-slate-700 hover:bg-slate-50 py-2.5 rounded-full flex items-center justify-center transition-all active:scale-95"
            title="Quick View"
          >
            <Eye size={16} />
          </button>

          <button
            onClick={() => addToCart(product._id, product.name)}
            className="col-span-4 apple-btn-primary py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all active:scale-95"
          >
            <ShoppingBag size={15} />
            <span>Add to Bag</span>
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-[#fcfbf9] min-h-screen text-[#0f172a] relative">
      <Navbar />

      {/* Hero Showcase Carousel */}
      <section className="pt-24 pb-6 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <motion.div
          key={bannerIndex}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white p-8 md:p-14 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between min-h-[420px] border border-slate-800"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 md:w-3/5 text-center md:text-left space-y-4">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start items-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-extrabold tracking-wider text-blue-300 uppercase">
                <Sparkles size={12} />
                {banners[bannerIndex].tag}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/25">
                <Zap size={11} className="text-blue-400" />
                {banners[bannerIndex].highlight}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {banners[bannerIndex].title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-normal max-w-xl">
              {banners[bannerIndex].subtitle}
            </p>

            <div className="pt-3 flex flex-wrap gap-4 justify-center md:justify-start items-center">
              <a
                href="#products-grid"
                className="apple-btn-primary text-sm py-3 px-6 shadow-lg inline-flex items-center gap-2 font-bold"
              >
                Explore Collection
                <ChevronRight size={16} />
              </a>

              <Link
                to="/users/helpcenter"
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors backdrop-blur-sm inline-flex items-center gap-2 border border-white/10"
              >
                <Sparkles size={15} className="text-blue-400" />
                <span>Genius AI Assist</span>
              </Link>
            </div>
          </div>

          <div className="relative z-10 md:w-2/5 mt-8 md:mt-0 flex justify-center preserve-3d">
            <motion.img
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              src={bannersImage[bannerIndex].image}
              alt="Banner Showcase"
              className="max-h-72 w-auto object-contain drop-shadow-[0_20px_50px_rgba(37,99,235,0.35)] animate-float-3d"
            />
          </div>

          {/* Carousel Slide Indicators */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-between px-8 pointer-events-none">
            <div className="flex gap-2 items-center pointer-events-auto">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBannerIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    bannerIndex === i
                      ? "w-8 bg-blue-500"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-1 items-center pointer-events-auto">
              <button
                onClick={() =>
                  setBannerIndex(
                    (prev) => (prev - 1 + banners.length) % banners.length
                  )
                }
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setBannerIndex((prev) => (prev + 1) % banners.length)
                }
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust & Guarantee Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 my-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-3xl border border-slate-900/5 shadow-sm">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0f172a]">Express Shipping</h4>
              <p className="text-[11px] text-slate-500">Free delivery over ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 font-bold">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0f172a]">Genuine Quality</h4>
              <p className="text-[11px] text-slate-500">2-Year Store Care Warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
              <Zap size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0f172a]">Instant Bag Sync</h4>
              <p className="text-[11px] text-slate-500">1-Click fast checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0f172a]">Genius AI Support</h4>
              <p className="text-[11px] text-slate-500">24/7 Smart assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 my-6 relative z-10">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {categoryList.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            const count = categoryCounts[cat.value];
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? "bg-[#0f172a] text-white shadow-md shadow-slate-900/20 scale-105"
                    : "bg-white text-slate-700 border border-slate-900/10 hover:bg-slate-100"
                }`}
              >
                {cat.icon && <span className="text-xs">{cat.icon}</span>}
                <span>{cat.label}</span>
                {count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Search Bar & Sorting Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 relative z-10">
        <div className="bg-white p-3 rounded-2xl border border-slate-900/10 shadow-sm flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search flagship products, specifications, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-[#fcfbf9] border border-slate-900/10 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-[#0f172a]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold px-2">
              <SlidersHorizontal size={14} />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#fcfbf9] border border-slate-900/10 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-600/30 cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Display Section */}
      <main id="products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 py-4 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-3 border-b border-slate-900/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0f172a]">
              Featured Collection
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Hand-picked devices engineered for ultra performance.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 mt-2 sm:mt-0 bg-white px-3 py-1 rounded-full border border-slate-900/10">
            Showing {filteredProducts.length} items
          </span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-80 bg-white rounded-3xl animate-pulse shadow-sm border border-slate-900/5"
              />
            ))
          ) : filteredProducts.length > 0 ? (
            <>
              {filteredProducts.slice(0, 8).map(renderProductCard)}

              {/* Luxury Banner Insert */}
              <div className="col-span-full my-4 rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#020617] text-white p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-xl border border-slate-800">
                <div className="md:w-1/2 space-y-3 z-10">
                  <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest inline-flex items-center gap-1">
                    <Star size={13} className="fill-current text-blue-400" />
                    EXCLUSIVE OFFER
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    Upgrade to Next-Gen Tech.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                    Get extra savings on top-rated headphones, monitors, and smartwear today.
                  </p>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="apple-btn-primary inline-flex items-center gap-2 text-xs sm:text-sm mt-3 font-bold"
                  >
                    <span>Shop All Gadgets</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
                <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center z-10">
                  <img
                    src="https://i.ibb.co/fY2pc8c1/LS20250730225719.png"
                    alt="Gadget Promo"
                    loading="lazy"
                    className="max-h-60 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {filteredProducts.slice(8).map(renderProductCard)}
            </>
          ) : (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl shadow-sm border border-slate-900/10">
              <PackageX size={48} className="mx-auto text-slate-400 mb-3" />
              <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                No matching products found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Try adjusting your search query or selected category filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSortBy("featured");
                }}
                className="apple-btn-dark text-xs mt-4 py-2 px-5 font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Quick View Product Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto border border-slate-900/10"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="bg-[#f4f3ef] rounded-2xl p-6 flex items-center justify-center border border-slate-900/10">
                  <img
                    src={
                      quickViewProduct.images?.[0]?.url ||
                      quickViewProduct.image?.url ||
                      "https://via.placeholder.com/200"
                    }
                    alt={quickViewProduct.name}
                    className="max-h-64 object-contain"
                  />
                </div>

                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                    {quickViewProduct.category || "Gadget"}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">
                    {quickViewProduct.name}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 font-medium">
                    {quickViewProduct.description ||
                      "High-performance design crafted with premium materials for maximum durability and unmatched user experience."}
                  </p>

                  <div className="pt-2">
                    {quickViewProduct.discount &&
                    quickViewProduct.price > quickViewProduct.discount ? (
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold text-[#0f172a]">
                            ₹{quickViewProduct.discount.toLocaleString("en-IN")}
                          </span>
                          <span className="text-base text-slate-400 line-through font-semibold">
                            ₹{quickViewProduct.price.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-emerald-600">
                          You save ₹
                          {(
                            quickViewProduct.price - quickViewProduct.discount
                          ).toLocaleString("en-IN")}{" "}
                          instantly!
                        </p>
                      </div>
                    ) : (
                      <span className="text-2xl font-extrabold text-[#0f172a]">
                        ₹{quickViewProduct.price.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <div className="pt-4 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        addToCart(quickViewProduct._id, quickViewProduct.name);
                        setQuickViewProduct(null);
                      }}
                      className="w-full apple-btn-primary py-3 flex items-center justify-center gap-2 text-sm font-bold shadow-md"
                    >
                      <ShoppingBag size={18} />
                      <span>Add to Bag</span>
                    </button>

                    <Link
                      to={`/products/${quickViewProduct._id}`}
                      onClick={() => setQuickViewProduct(null)}
                      className="w-full text-center py-2 text-xs font-bold text-blue-600 hover:underline"
                    >
                      View Full Specifications →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Home;
