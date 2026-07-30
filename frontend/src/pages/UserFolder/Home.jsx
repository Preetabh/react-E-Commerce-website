/* eslint-disable no-unused-vars */
import Lenis from "@studio-freight/lenis";
import axios from "axios";
import { motion } from "framer-motion";
import { PackageX, Search, ShoppingBag, ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FaCamera,
  FaClock,
  FaHeadphones,
  FaLaptop,
  FaMobileAlt,
  FaTv,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "../../App.css";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Prism from "../../components/Prism.jsx";

const Home = () => {


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const banners = [
    {
      title: "Store. The best way to buy the products you love.",
      subtitle: "Discover the newest gadgets, ultimate speed, and timeless design.",
      tag: "FLAGSHIP SELECTION",
    },
    {
      title: "Pro performance. Sleek aesthetic.",
      subtitle: "Unmatched clarity and next-gen audio hardware at incredible prices.",
      tag: "NEW ARRIVALS",
    },
    {
      title: "Designed to amaze. Crafted to last.",
      subtitle: "Get up to 30% off on flagship products with instant delivery.",
      tag: "LIMITED EDITION",
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
        "https://i.ibb.co/mrGH4zrF/wireless-earbuds-with-neon-cyberpunk-style-lighting.png",
    },
  ];

  const categoryList = [
    { label: "All Items", value: "" },
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
    }, 5500);
    return () => clearInterval(interval);
  }, []);

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
            background: "#1d1d1f",
            color: "#fff",
            borderRadius: "12px",
            fontWeight: "500",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
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
          background: "#0071e3",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "500",
          boxShadow: "0 10px 25px rgba(0,113,227,0.3)",
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
          background: "#ff3b30",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "500",
        },
      }).showToast();
    }
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedCategory === ""
        ? true
        : product.category &&
          product.category.toLowerCase().includes(selectedCategory)
    );

  // 3D Card Tilt state helper
  const handleMouseMove3D = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave3D = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  const renderProductCard = (product) => {
    const hasDiscount = product.discount && product.price > product.discount;
    const discountAmt = hasDiscount ? product.price - product.discount : 0;

    return (
      <motion.div
        key={product._id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onMouseMove={handleMouseMove3D}
        onMouseLeave={handleMouseLeave3D}
        className="apple-card apple-3d-card shine-effect group flex flex-col justify-between p-6 relative overflow-hidden bg-white shadow-md transition-all duration-300"
      >
        <Link to={`/products/${product._id}`} className="block flex-1">
          {hasDiscount && (
            <span className="absolute top-4 left-4 z-10 bg-[#1d1d1f] text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Save ₹{discountAmt}
            </span>
          )}

          <div className="relative h-56 w-full flex items-center justify-center p-4 mb-4 bg-[#fbfbfd] rounded-2xl group-hover:bg-[#f5f5f7] transition-colors preserve-3d">
            <img
              src={
                product.images?.[0]?.url ||
                product.image?.url ||
                "https://via.placeholder.com/200"
              }
              alt={product.name}
              loading="lazy"
              className="max-h-48 max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500 ease-out preserve-3d"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/200";
                e.target.onerror = null;
              }}
            />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
              {product.category || "Gadget"}
            </span>
            <h3 className="text-base font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-[#1d1d1f]">
                  ₹{product.discount.toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-[#86868b] line-through">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-[#1d1d1f]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </Link>

        <button
          onClick={() => addToCart(product._id, product.name)}
          className="mt-5 w-full apple-btn-primary py-2.5 flex items-center justify-center gap-2 text-sm font-medium transition-transform active:scale-95 shadow-sm"
        >
          <ShoppingBag size={16} />
          <span>Add to Bag</span>
        </button>
      </motion.div>
    );
  };


  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f] relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0.5}
          glow={1}
        />
      </div>
      <Navbar />




      {/* Hero Apple Store Showcase */}
      <section className="pt-24 pb-10 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          key={bannerIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full rounded-3xl bg-gradient-to-br from-[#161617] via-[#1d1d1f] to-[#000000] text-white p-8 md:p-14 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between min-h-[380px]"
        >
          {/* Glowing Gradient Backdrop Orb */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0071e3]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 md:w-3/5 text-center md:text-left space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wider text-blue-300 uppercase">
              <Sparkles size={12} />
              {banners[bannerIndex].tag}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {banners[bannerIndex].title}
            </h1>
            <p className="text-base sm:text-lg text-gray-300 font-normal max-w-xl">
              {banners[bannerIndex].subtitle}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start items-center">
              <a
                href="#products-grid"
                className="apple-btn-primary text-sm py-3 px-6 shadow-lg inline-flex items-center gap-2"
              >
                Explore Collection
                <ChevronRight size={16} />
              </a>

              {/* Carousel Slide Indicators */}
              <div className="flex gap-2 items-center ml-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setBannerIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      bannerIndex === i ? "w-8 bg-blue-500" : "w-2 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 md:w-2/5 mt-8 md:mt-0 flex justify-center preserve-3d">
            <motion.img
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              src={bannersImage[bannerIndex].image}
              alt="Banner Showcase"
              className="max-h-72 w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,113,227,0.4)] animate-float-3d"
            />
          </div>

        </motion.div>
      </section>

      {/* Category Pills Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 my-6">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
          {categoryList.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? "bg-[#1d1d1f] text-white shadow-md scale-105"
                    : "bg-white text-[#1d1d1f] border border-black/5 hover:bg-black/5"
                }`}
              >
                {cat.icon && <span className="text-base">{cat.icon}</span>}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Apple Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for products, categories, or specs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-black/10 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-4 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Products Display Section */}
      <main id="products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 pb-4 border-b border-black/10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
              Featured Products
            </h2>
            <p className="text-sm text-[#86868b] mt-1">
              Hand-picked gadgets engineered for high performance.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#86868b] mt-2 md:mt-0">
            Showing {filteredProducts.length} items
          </span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-80 bg-white rounded-3xl animate-pulse shadow-sm border border-black/5"
              />
            ))
          ) : filteredProducts.length > 0 ? (
            <>
              {filteredProducts.slice(0, 8).map(renderProductCard)}

              {/* Luxury Apple Banner Card */}
              <div className="col-span-full my-6 rounded-3xl bg-gradient-to-r from-[#1d1d1f] via-[#2c2c2e] to-[#161617] text-white p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-xl">
                <div className="md:w-1/2 space-y-3 z-10">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                    EXCLUSIVE OFFER
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                    Upgrade to Next-Gen Tech.
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300 max-w-md">
                    Get extra savings on top-rated headphones, monitors, and smartwear today.
                  </p>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="apple-btn-primary inline-flex items-center gap-2 text-sm mt-4"
                  >
                    <span>Shop All Gadgets</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center z-10">
                  <img
                    src="https://i.ibb.co/fY2pc8c1/LS20250730225719.png"
                    alt="Gadget Promo"
                    loading="lazy"
                    className="max-h-64 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {filteredProducts.slice(8).map(renderProductCard)}
            </>
          ) : (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl shadow-sm border border-black/5">
              <PackageX size={48} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-[#1d1d1f]">No matching products found</h3>
              <p className="text-sm text-[#86868b] mt-1">Try adjusting your search query or selected category filter.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="apple-btn-dark text-xs mt-4 py-2 px-5"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;

