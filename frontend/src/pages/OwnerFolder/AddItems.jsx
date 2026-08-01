import { useState, useEffect } from "react";
import axios from "axios";
import OwnerNavbar from "../../components/OwnerNavbar.jsx";
import Footer from "../../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import {
  Upload,
  X,
  PlusCircle,
  CheckCircle2,
  Sparkles,
  Zap,
  Wand2,
  Search,
  RefreshCw,
} from "lucide-react";
import "../../App.css";

const suggestedProducts = [
  "iPhone 16 Pro Max",
  "Samsung Galaxy S25 Ultra",
  "Keychron K2 Pro Mechanical Keyboard",
  "Logitech MX Keys S Keyboard",
  "Sony WH-1000XM6",
  "MacBook Pro M3 Max",
  "Razer BlackWidow V4 Pro",
  "Apple Watch Ultra 2",
];

const AddItems = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    discount: "",
    discountPercentage: "",
    bgcolor: "#ffffff",
    panelcolor: "#f0f0f0",
    textcolor: "#000000",
    details: "",
    information: "",
    keyFeatures: "",
    warranty: "1 Year Official Brand Warranty",
    stock: "50",
    sku: "",
    tags: "",
    seoTitle: "",
    seoDescription: "",
    category: "electronics",
    images: [],
    imageUrlList: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // AI Generator Modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/owner/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (formData.images.length + files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
    setError("");
  };

  const removeImage = (index) => {
    const targetUrl = previewImages[index];
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));

    if (formData.images[index]) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }

    if (formData.imageUrlList[index]) {
      setFormData((prev) => ({
        ...prev,
        imageUrlList: prev.imageUrlList.filter((_, i) => i !== index),
      }));
    }

    if (targetUrl && targetUrl.startsWith("blob:")) {
      URL.revokeObjectURL(targetUrl);
    }
  };

  // 1-Click Groq AI Generator Action
  const handleGenerateWithAi = async (queryToUse) => {
    const query = queryToUse || aiQuery;
    if (!query || !query.trim()) {
      setError("Please enter or select a product model name.");
      return;
    }

    setAiGenerating(true);
    setError("");
    setAiSuccessMsg("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ai-help/generate-product`,
        { query }
      );

      if (response.data?.success && response.data?.data) {
        const data = response.data.data;

        // Auto-populate all form fields
        setFormData({
          name: data.name || query,
          brand: data.brand || "",
          price: data.price ? String(data.price) : "",
          discount: data.discount ? String(data.discount) : "",
          discountPercentage: data.discountPercentage ? String(data.discountPercentage) : "",
          bgcolor: "#ffffff",
          panelcolor: "#f0f0f0",
          textcolor: "#000000",
          details: data.details || "",
          information: data.information || "",
          keyFeatures: Array.isArray(data.keyFeatures)
            ? data.keyFeatures.join("\n• ")
            : data.keyFeatures || "",
          warranty: data.warranty || "1 Year Official Brand Warranty",
          stock: data.stock ? String(data.stock) : "50",
          sku: data.sku || `SKU-${Date.now()}`,
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags || "",
          seoTitle: data.seoTitle || data.name || "",
          seoDescription: data.seoDescription || data.details || "",
          category: data.category || "electronics",
          images: [],
          imageUrlList: data.images || [],
        });

        // Set image previews
        if (Array.isArray(data.images) && data.images.length > 0) {
          setPreviewImages(data.images);
        }

        setAiSuccessMsg(`✨ Successfully generated AI catalog entry for "${data.name}"!`);
        setTimeout(() => {
          setShowAiModal(false);
          setAiSuccessMsg("");
        }, 1500);
      }
    } catch (err) {
      console.error("AI Generation error:", err);
      setError(err.response?.data?.message || "Failed to generate AI product specs.");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (previewImages.length === 0 && formData.images.length === 0) {
      setError("Please upload product images or use AI image generator");
      return;
    }

    if (!formData.name || !formData.price || !formData.category) {
      setError("Product Title, Price, and Category are required.");
      return;
    }

    const result = await Swal.fire({
      title: "Publish New Product?",
      text: `Add "${formData.name}" to the live Shop Mart catalog?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0f172a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Publish Now",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-3xl font-sans bg-white text-slate-900 border border-slate-200 shadow-2xl",
      },
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let response;
      const token = localStorage.getItem("token");

      if (formData.images && formData.images.length > 0) {
        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
          if (key !== "images" && key !== "imageUrlList") {
            data.append(key, value);
          }
        });

        formData.images.forEach((image) => {
          data.append("images", image);
        });

        if (formData.imageUrlList && formData.imageUrlList.length > 0) {
          data.append("imageUrlList", JSON.stringify(formData.imageUrlList));
        }

        response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/products/addProduct`,
          data,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
      } else {
        const jsonPayload = {
          ...formData,
          imageUrlList: formData.imageUrlList.length > 0 ? formData.imageUrlList : previewImages,
        };

        response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/products/addProduct`,
          jsonPayload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
      }

      setSuccess(response.data.message || "Product published successfully!");

      setFormData({
        name: "",
        brand: "",
        price: "",
        discount: "",
        discountPercentage: "",
        bgcolor: "#ffffff",
        panelcolor: "#f0f0f0",
        textcolor: "#000000",
        details: "",
        information: "",
        keyFeatures: "",
        warranty: "1 Year Official Brand Warranty",
        stock: "50",
        sku: "",
        tags: "",
        seoTitle: "",
        seoDescription: "",
        category: "electronics",
        images: [],
        imageUrlList: [],
      });

      setPreviewImages([]);
    } catch (err) {
      console.error("Publish error:", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Something went wrong while publishing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen flex flex-col justify-between font-sans">
      <div>
        <OwnerNavbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16 relative z-10">
          {/* Header Action Bar */}
          <div className="mb-8 pb-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                <span>Add Product Catalog Entry</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Enter details manually or generate complete specifications &amp; gallery imagery using Groq AI.
              </p>
            </div>

            {/* AI Generator Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setShowAiModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 py-2.5 px-5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md shadow-amber-500/20 shrink-0 transition-colors"
            >
              <Sparkles size={16} className="text-slate-950" />
              <span>Generate with AI</span>
            </motion.button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 space-y-6 shadow-sm"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-semibold">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            {/* AI Auto-Populate Notice */}
            {formData.name && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <Zap size={14} className="text-amber-600" />
                  Form auto-populated with AI specs. Review &amp; edit any field before publishing.
                </span>
                {formData.sku && (
                  <span className="text-[10px] font-mono bg-amber-200/60 px-2 py-0.5 rounded text-amber-900">
                    SKU: {formData.sku}
                  </span>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1.5">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Apple iPhone 16 Pro Max 256GB Black Titanium"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  placeholder="e.g. Apple, Samsung, Sony, Keychron"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Mobile, Laptops, Headphones, Keyboards, Watch"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Regular Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="144900"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Discounted Price (₹)
                </label>
                <input
                  type="number"
                  name="discount"
                  placeholder="134900"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  SKU Identifier
                </label>
                <input
                  type="text"
                  name="sku"
                  placeholder="APL-IP16PM-256"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-mono text-[11px] focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  placeholder="50"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1.5">
                  Product Overview &amp; Description *
                </label>
                <textarea
                  name="details"
                  placeholder="Detailed overview describing flagship performance and design..."
                  value={formData.details}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium h-24 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1.5">
                  Technical Specifications
                </label>
                <textarea
                  name="information"
                  placeholder="• Processor: A18 Pro Chip&#10;• Display: 6.9-inch OLED 120Hz..."
                  value={formData.information}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium h-24 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1.5">
                  Key Features (One per line)
                </label>
                <textarea
                  name="keyFeatures"
                  placeholder="Grade 5 Titanium Body&#10;48MP Camera with 5x Optical Zoom&#10;Camera Control Button"
                  value={formData.keyFeatures}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium h-20 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Warranty Information
                </label>
                <input
                  type="text"
                  name="warranty"
                  placeholder="1 Year Official Brand Warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="flagship, 5g, apple, titanium"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  SEO Title
                </label>
                <input
                  type="text"
                  name="seoTitle"
                  placeholder="Buy Apple iPhone 16 Pro Max Online"
                  value={formData.seoTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  SEO Description
                </label>
                <input
                  type="text"
                  name="seoDescription"
                  placeholder="Order Apple iPhone 16 Pro Max with A18 Pro chip..."
                  value={formData.seoDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>
            </div>

            {/* Product Image Uploader & Preview */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Product Gallery Images ({previewImages.length} selected)
                </label>
                <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  AI Generated or Custom Uploads
                </span>
              </div>

              <div className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50">
                <input
                  type="file"
                  accept="image/*"
                  name="images"
                  onChange={handleImageChange}
                  multiple
                  className="hidden"
                  id="imageUploadInput"
                />
                <label
                  htmlFor="imageUploadInput"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload size={24} className="text-slate-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Click to upload custom product photos
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Supports PNG, JPG, WebP up to 5 photos
                  </span>
                </label>
              </div>

              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                  {previewImages.map((url, index) => (
                    <div
                      key={index}
                      className="relative group w-full h-24 bg-white rounded-xl border border-slate-200 p-2 overflow-hidden shadow-xs"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
                          e.target.onerror = null;
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-slate-900 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 text-sm font-extrabold rounded-2xl flex items-center justify-center gap-2 mt-6 shadow-md transition-all active:scale-98 disabled:opacity-50"
            >
              <PlusCircle size={18} />
              <span>{loading ? "Publishing Product..." : "Publish Product Catalog Entry"}</span>
            </button>
          </form>
        </main>
      </div>

      {/* AI Product Generator Modal */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white text-slate-900 rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 relative overflow-hidden border border-slate-200"
            >
              <button
                onClick={() => setShowAiModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      AI Product Generator
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Powered by Groq Llama-3.3-70B AI Engine
                    </p>
                  </div>
                </div>

                {aiSuccessMsg ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span>{aiSuccessMsg}</span>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Enter or click a device model name below. Groq AI will instantly generate the title, brand, category, regular price, discount price, overview, technical specs, key features, warranty, stock, SKU, SEO metadata, and product image search keywords!
                    </p>

                    <div>
                      <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-2">
                        Suggested Flagship Models:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {suggestedProducts.map((name) => (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setAiQuery(name);
                              handleGenerateWithAi(name);
                            }}
                            disabled={aiGenerating}
                            className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white transition-colors disabled:opacity-50"
                          >
                            + {name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Or enter custom product query:
                      </label>
                      <div className="relative">
                        <Search
                          size={18}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="text"
                          placeholder="e.g. Keychron K2 Pro Keyboard, Sony WH-1000XM6..."
                          value={aiQuery}
                          onChange={(e) => setAiQuery(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleGenerateWithAi()}
                          disabled={aiGenerating}
                          className="w-full pl-10 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGenerateWithAi()}
                      disabled={aiGenerating || !aiQuery.trim()}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md disabled:opacity-50 mt-4 transition-all"
                    >
                      {aiGenerating ? (
                        <>
                          <RefreshCw size={16} className="animate-spin text-white" />
                          <span>Groq AI Generating Specs &amp; Keywords...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 size={16} />
                          <span>Generate 1-Click Catalog Entry</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default AddItems;
