import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../UserFolder/modern.css";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShoppingBag, Star, ShieldCheck, Truck, RotateCcw, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const ProductsDetails = () => {
  const [loader, setLoader] = useState(false);
  const [product, setProduct] = useState(null);
  const [item, setItem] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    if (product?.images?.length > 0) setSelectedImage(0);
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoader(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("❌ Error fetching product:", error);
        toast.error("Failed to fetch product details! ❌");
      } finally {
        setLoader(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/products/suggest/${id}`
        );
        setItem(response.data);
      } catch (error) {
        console.error("❌ Error fetching suggested products:", error);
      }
    };
    fetchSuggestedProducts();
  }, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Toastify({
          text: `Please sign in to add to your Bag.`,
          duration: 3000,
          gravity: "top",
          position: "right",
          style: {
            background: "#1d1d1f",
            color: "#fff",
            borderRadius: "12px",
            fontWeight: "500",
            padding: "14px 20px",
          },
        }).showToast();
        navigate(`/users/login`);
        return;
      }
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/addtocart`,
        { productId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Product added to Bag successfully! 🛒");
    } catch (error) {
      console.error("❌ Error adding product to cart:", error);
      toast.error("Failed to add product to Bag. ❌");
    }
  };

  const handleBuynow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Toastify({
        text: `Please sign in to continue to Checkout.`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "#1d1d1f",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "500",
          padding: "14px 20px",
        },
      }).showToast();
      navigate(`/users/login`);
      return;
    }
    navigate(`/users/buynow/${product._id}`);
  };

  const discountPercent =
    product && product.price && product.discount
      ? Math.round(((product.price - product.discount) / product.price) * 100)
      : 0;

  const fmt = (n) =>
    typeof n === "number" ? n.toLocaleString("en-IN") : n || "-";

  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#86868b] mb-8">
          <Link to="/" className="hover:text-[#0071e3] transition">
            Store
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#1d1d1f] truncate max-w-xs">{product?.name || "Product Showcase"}</span>
        </div>

        {loader ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              className="text-[#0071e3] mb-4"
            >
              <ShoppingBag size={48} />
            </motion.div>
            <p className="text-base font-medium text-[#86868b]">
              Loading product showcase...
            </p>
          </div>
        ) : !product ? (
          <div className="max-w-4xl mx-auto p-12 bg-white rounded-3xl shadow-sm border border-black/5 animate-pulse">
            <div className="h-72 bg-gray-200 rounded-2xl mb-6"></div>
            <div className="h-8 bg-gray-200 w-2/3 mb-4 rounded-lg"></div>
            <div className="h-5 bg-gray-200 w-1/3 mb-6 rounded-lg"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Showcase: Main Image & Thumbnails */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-black/5 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Vertical thumbnails */}
                <div className="hidden sm:flex flex-col gap-3 w-20">
                  {(product.images?.length ? product.images : [product.image]).map(
                    (img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`rounded-2xl overflow-hidden p-1 transition-all border-2 ${
                          selectedImage === idx
                            ? "border-[#0071e3] shadow-md scale-105"
                            : "border-transparent bg-[#f5f5f7] hover:bg-gray-200"
                        }`}
                      >
                        <img
                          src={img?.url || "https://via.placeholder.com/150"}
                          alt={`${product.name} ${idx}`}
                          className="w-16 h-16 object-contain"
                        />
                      </button>
                    )
                  )}
                </div>

                <div className="flex-1 flex flex-col items-center justify-center min-h-[380px] bg-[#fbfbfd] rounded-2xl p-6 relative">
                  {discountPercent > 0 && (
                    <span className="absolute top-4 left-4 bg-[#1d1d1f] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      Save {discountPercent}%
                    </span>
                  )}
                  <img
                    src={
                      product.images?.[selectedImage]?.url ||
                      product.image?.url ||
                      "https://via.placeholder.com/500x500?text=No+Image"
                    }
                    alt={product.name}
                    className="max-h-[380px] max-w-full object-contain transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Mobile thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto sm:hidden">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 rounded-xl overflow-hidden p-1 border-2 ${
                        selectedImage === index
                          ? "border-[#0071e3]"
                          : "border-gray-200 bg-[#f5f5f7]"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt="Thumbnail"
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Purchase Box */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#86868b] uppercase tracking-widest mb-2">
                    <Sparkles size={12} className="text-[#0071e3]" />
                    {product.category || "Flagship Device"}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
                    {product.name}
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-[#1d1d1f] text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                    <Star size={12} className="fill-current text-yellow-400" />
                    <span>4.8 Rating</span>
                  </div>
                  <span className="text-xs text-[#86868b]">Verified Product</span>
                </div>

                {/* Price Display */}
                <div className="pt-2 border-t border-black/5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-[#1d1d1f]">
                      ₹{fmt(product.discount || product.price)}
                    </span>
                    {product.discount && product.price > product.discount && (
                      <span className="text-[#86868b] line-through text-lg">
                        ₹{fmt(product.price)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#86868b] mt-1">Inclusive of all taxes & free delivery</p>
                </div>

                <p className="text-sm text-[#515154] leading-relaxed">
                  {product.details || product.information}
                </p>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                  <button
                    onClick={addToCart}
                    className="w-full apple-btn-primary py-3.5 flex items-center justify-center gap-2 text-base font-semibold shadow-md active:scale-95"
                  >
                    <ShoppingBag size={18} />
                    <span>Add to Bag</span>
                  </button>
                  <button
                    onClick={handleBuynow}
                    className="w-full apple-btn-dark py-3.5 flex items-center justify-center gap-2 text-base font-semibold active:scale-95"
                  >
                    <span>Buy Now with Express Checkout</span>
                  </button>
                </div>

                {/* Apple Value Badges */}
                <div className="pt-6 border-t border-black/5 grid grid-cols-3 gap-2 text-center text-[11px] text-[#86868b]">
                  <div className="flex flex-col items-center">
                    <Truck size={18} className="text-[#1d1d1f] mb-1" />
                    <span>Free Express Delivery</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <RotateCcw size={18} className="text-[#1d1d1f] mb-1" />
                    <span>7-Day Easy Return</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ShieldCheck size={18} className="text-[#1d1d1f] mb-1" />
                    <span>1-Year Warranty</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Products Showcase Grid */}
            <div className="lg:col-span-12 mt-8">
              <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] mb-6">
                You Might Also Like
              </h2>
              {item?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {item.map((items) => (
                    <div
                      key={items._id}
                      className="apple-card p-5 bg-white flex flex-col justify-between hover:shadow-xl transition"
                    >
                      <div>
                        <div className="h-44 flex items-center justify-center p-3 bg-[#fbfbfd] rounded-2xl mb-4">
                          <img
                            src={items?.images?.[0]?.url || items?.image?.url}
                            alt={items.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <h3 className="font-semibold text-sm text-[#1d1d1f] truncate">
                          {items.name}
                        </h3>
                        <p className="text-base font-bold text-[#1d1d1f] mt-1">
                          ₹{fmt(items.discount || items.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/products/${items._id}`)}
                        className="mt-4 w-full apple-btn-dark text-xs py-2"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#86868b]">No additional recommendations at this time.</p>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={1500} hideProgressBar />
    </div>
  );
};

export default ProductsDetails;

