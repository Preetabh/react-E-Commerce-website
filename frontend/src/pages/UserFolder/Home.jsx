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
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "700",
          boxShadow: "0 10px 25px rgba(15,23,42,0.35)",
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
        className="bg-white border border-slate-200/80 group flex flex-col justify-between p-5 rounded-3xl transition-all duration-300 relative overflow-hidden shadow-xs hover:shadow-md"
      >
        <div className="block flex-1">
          {/* Top Tag Badges */}
          <div className="flex items-center justify-between gap-2 mb-3">
            {hasDiscount ? (
              <span className="bg-[#0f172a] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                Save ₹{discountAmt.toLocaleString("en-IN")} ({discountPercent}% OFF)
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {product.category || "Gadget"}
              </span>
            )}

            <button
              onClick={() => setQuickViewProduct(product)}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="Quick View"
            >
              <Eye size={17} />
            </button>
          </div>

          {/* Product Image Container */}
          <Link to={`/products/${product._id}`} className="block">
            <div className="relative h-52 w-full flex items-center justify-center p-4 mb-4 bg-slate-50 rounded-2xl group-hover:bg-slate-100/80 transition-all duration-300 border border-slate-100">
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
                  e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
                  e.target.onerror = null;
                }}
              />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">
                {product.category || "Flagship Model"}
              </span>
              <h3 className="text-base font-extrabold text-[#0f172a] group-hover:text-slate-700 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-black text-[#0f172a]">
                ₹{(product.discount || product.price).toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through font-semibold">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </Link>
        </div>

        <div className="pt-4 mt-2 border-t border-slate-100 grid grid-cols-5 gap-2">
          <Link
            to={`/products/${product._id}`}
            className="col-span-1 border border-slate-200 text-slate-700 hover:bg-slate-100 py-2.5 rounded-xl flex items-center justify-center transition-colors"
            title="View Details"
          >
            <ArrowRight size={16} />
          </Link>
          <button
            onClick={() => addToCart(product._id, product.name)}
            className="col-span-4 bg-[#0f172a] hover:bg-slate-800 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold transition-all active:scale-95 shadow-xs"
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

      {/* Classy Light Theme Hero Showcase */}
      <section className="pt-24 pb-6 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <motion.div
          key={bannerIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full rounded-3xl bg-white border border-slate-200/80 text-slate-900 p-8 sm:p-12 md:p-14 overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between min-h-[440px]"
        >
          {/* Subtle Ambient Decorative Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-900/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 md:w-3/5 text-center md:text-left space-y-4">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start items-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900 text-white text-xs font-extrabold tracking-wider uppercase shadow-xs">
                <Sparkles size={13} className="text-amber-400" />
                {banners[bannerIndex].tag}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-extrabold border border-amber-200">
                <Zap size={12} className="text-amber-600" />
                {banners[bannerIndex].highlight}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              {banners[bannerIndex].title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl">
              {banners[bannerIndex].subtitle}
            </p>

            <div className="pt-4 flex flex-wrap gap-3 justify-center md:justify-start items-center">
              <a
                href="#products-grid"
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-extrabold py-3.5 px-7 rounded-2xl shadow-md inline-flex items-center gap-2 transition-all active:scale-98"
              >
                <span>Explore Collection</span>
                <ChevronRight size={16} />
              </a>
            </div>
          </div>

          <div className="relative z-10 md:w-2/5 mt-8 md:mt-0 flex justify-center w-full">
            <div className="relative w-full max-w-sm h-72 rounded-3xl bg-gradient-to-tr from-slate-100 to-amber-50/40 border border-slate-200/60 p-6 flex items-center justify-center shadow-inner">
              <motion.img
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                src={bannersImage[bannerIndex].image}
                alt="Banner Showcase"
                className="max-h-60 w-auto object-contain drop-shadow-[0_15px_30px_rgba(15,23,42,0.12)]"
              />
            </div>
          </div>

          {/* Carousel Controls & Indicators */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-between px-8 pointer-events-none">
            <div className="flex gap-2 items-center pointer-events-auto">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBannerIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    bannerIndex === i
                      ? "w-8 bg-slate-900"
                      : "w-2 bg-slate-200 hover:bg-slate-400"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-1.5 items-center pointer-events-auto">
              <button
                onClick={() =>
                  setBannerIndex(
                    (prev) => (prev - 1 + banners.length) % banners.length
                  )
                }
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setBannerIndex((prev) => (prev + 1) % banners.length)
                }
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust & Guarantee Strip */}
      <section className="py-6 px-4 max-w-7xl mx-auto border-y border-slate-200/60 my-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs font-semibold text-slate-600">
          <div className="flex items-center justify-center gap-2">
            <Truck size={18} className="text-slate-900" />
            <span>Free Express Shipping</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck size={18} className="text-slate-900" />
            <span>1 Year Official Warranty</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <RotateCcw size={18} className="text-slate-900" />
            <span>14-Day Easy Returns</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Star size={18} className="text-amber-500 fill-amber-500" />
            <span>4.9 / 5 Rated Experience</span>
          </div>
        </div>
      </section>

      {/* Main Catalog Search & Category Filter Section */}
      <section id="products-grid" className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Flagship Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Select from curated categories or search by model name.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search products or models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 shadow-xs transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold text-slate-700 w-full sm:w-auto">
              <SlidersHorizontal size={15} className="text-slate-500" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-extrabold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discounts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pill Counters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoryList.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            const count = categoryCounts[cat.value] || 0;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold shrink-0 transition-all ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs"
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white p-5 rounded-3xl border border-slate-200 animate-pulse space-y-4"
              >
                <div className="h-48 bg-slate-100 rounded-2xl w-full" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
            {filteredProducts.map((product) => renderProductCard(product))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <PackageX size={48} className="mx-auto text-slate-400" />
            <h3 className="text-lg font-bold text-slate-900">No products found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find any items matching &quot;{searchTerm}&quot;. Try adjusting your search query or category filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              className="bg-slate-900 text-white text-xs font-bold py-2.5 px-5 rounded-2xl shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative border border-slate-200 overflow-hidden"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="bg-slate-50 rounded-2xl p-6 flex items-center justify-center border border-slate-100 h-64">
                  <img
                    src={
                      quickViewProduct.images?.[0]?.url ||
                      quickViewProduct.image?.url ||
                      "https://via.placeholder.com/200"
                    }
                    alt={quickViewProduct.name}
                    className="max-h-52 object-contain"
                  />
                </div>

                <div className="space-y-4">
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
                    {quickViewProduct.category || "Flagship"}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 leading-snug">
                    {quickViewProduct.name}
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-3 font-medium">
                    {quickViewProduct.details || quickViewProduct.information || "Premium quality flagship product."}
                  </p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      ₹{(quickViewProduct.discount || quickViewProduct.price).toLocaleString("en-IN")}
                    </span>
                    {quickViewProduct.discount && quickViewProduct.price > quickViewProduct.discount && (
                      <span className="text-xs text-slate-400 line-through font-semibold">
                        ₹{quickViewProduct.price.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => {
                        addToCart(quickViewProduct._id, quickViewProduct.name);
                        setQuickViewProduct(null);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 px-6 rounded-2xl text-xs flex-1 flex items-center justify-center gap-2 shadow-md"
                    >
                      <ShoppingBag size={16} />
                      <span>Add to Bag</span>
                    </button>
                    <Link
                      to={`/products/${quickViewProduct._id}`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold py-3 px-5 rounded-2xl text-xs flex items-center justify-center border border-slate-200"
                    >
                      Details
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
