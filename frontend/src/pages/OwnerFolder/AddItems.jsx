import { useState, useEffect } from "react";
import axios from "axios";
import OwnerNavbar from "../../components/OwnerNavbar.jsx";
import Footer from "../../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Upload, X, PlusCircle, Check } from "lucide-react";
import "../../App.css";

const colorOptions = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#ff0000" },
  { name: "Green", value: "#00ff00" },
  { name: "Blue", value: "#0000ff" },
];

const AddItems = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discount: "",
    bgcolor: "#ffffff",
    panelcolor: "#f0f0f0",
    textcolor: "#000000",
    details: "",
    information: "",
    category: "",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/owner/login");
    }
  }, [navigate]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "name"
          ? value.charAt(0).toUpperCase() + value.slice(1)
          : value,
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
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length < 3) {
      setError("Please upload at least 3 images for the product");
      return;
    }

    const result = await Swal.fire({
      title: "Confirm New Product?",
      text: "Publish this device model to the Shop Mart store catalog?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0071e3",
      cancelButtonColor: "#1d1d1f",
      confirmButtonText: "Yes, Publish",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'rounded-3xl font-sans bg-[#1d1d1f] text-white',
      }
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    setError("");
    setSuccess("");

    if (
      Object.values(formData).some((value) => value === "" || value === null)
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "images") {
          data.append(key, value);
        }
      });

      formData.images.forEach((image) => {
        data.append(`images`, image);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/products/addProduct`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess(response.data.message || "Product published successfully!");

      setFormData({
        name: "",
        price: "",
        discount: "",
        bgcolor: "#ffffff",
        panelcolor: "#f0f0f0",
        textcolor: "#000000",
        details: "",
        information: "",
        category: "",
        images: [],
      });

      previewImages.forEach((url) => URL.revokeObjectURL(url));
      setPreviewImages([]);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f11] text-[#f5f5f7] min-h-screen flex flex-col justify-between font-sans">
      <div>
        <OwnerNavbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="mb-8 pb-6 border-b border-white/10">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Add New Product Catalog Entry
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Specify pricing, categories, and high-resolution images.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="apple-card-dark p-8 sm:p-10 bg-white/5 border border-white/10 space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-xs flex items-center gap-2">
                <Check size={16} />
                <span>{success}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-gray-400 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. iPhone 15 Pro Max 256GB Titanium"
                  value={formData.name}
                  onChange={handleChange}
                  className="apple-input bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Regular Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="129900"
                  value={formData.price}
                  onChange={handleChange}
                  className="apple-input bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Discounted Price (₹)</label>
                <input
                  type="number"
                  name="discount"
                  placeholder="119900"
                  value={formData.discount}
                  onChange={handleChange}
                  className="apple-input bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-400 font-semibold mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Mobiles, Laptops, Audio"
                  value={formData.category}
                  onChange={handleChange}
                  className="apple-input bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-400 font-semibold mb-1">Product Details &amp; Overview</label>
                <textarea
                  name="details"
                  placeholder="Enter detailed description..."
                  value={formData.details}
                  onChange={handleChange}
                  className="apple-input bg-white/5 border-white/10 text-white placeholder-gray-500 h-24"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-400 font-semibold mb-1">Technical Specifications</label>
                <textarea
                  name="information"
                  placeholder="Processor, Display, Battery, Specs..."
                  value={formData.information}
                  onChange={handleChange}
                  className="apple-input bg-white/5 border-white/10 text-white placeholder-gray-500 h-24"
                />
              </div>
            </div>

            {/* Product Image Uploader */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-gray-400">
                Upload Product Gallery Images (Min 3, Max 5)
              </label>
              
              <div className="border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-2xl p-6 text-center cursor-pointer transition bg-white/5">
                <input
                  type="file"
                  accept="image/*"
                  name="images"
                  onChange={handleImageChange}
                  multiple
                  className="hidden"
                  id="imageUploadInput"
                />
                <label htmlFor="imageUploadInput" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload size={28} className="text-blue-400" />
                  <span className="text-xs font-semibold text-white">Click to upload product photos</span>
                  <span className="text-[11px] text-gray-400">Selected {formData.images.length} of 5 images</span>
                </label>
              </div>

              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                  {previewImages.map((url, index) => (
                    <div key={index} className="relative group w-full h-24 bg-white/5 rounded-xl border border-white/10 p-2 overflow-hidden">
                      <img src={url} alt={`Preview ${index}`} className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100"
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
              className="w-full apple-btn-primary py-3.5 text-sm font-semibold flex items-center justify-center gap-2 mt-6 active:scale-95 disabled:opacity-50"
            >
              <PlusCircle size={18} />
              <span>{loading ? "Publishing Product..." : "Publish Product"}</span>
            </button>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AddItems;

