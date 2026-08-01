import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import OwnerNavbar from "../../components/OwnerNavbar.jsx";
import Footer from "../../components/Footer.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { Save, Trash2, ArrowLeft, Check } from "lucide-react";
import "../../App.css";

const ItemsEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discount: "",
    bgcolor: "#ffffff",
    panelcolor: "#f0f0f0",
    textcolor: "#000000",
    details: "",
    information: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/owner/login");
    }

    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/owner/EditProduct/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const product = res.data;
        setFormData({
          name: product.name || "",
          price: product.price || "",
          discount: product.discount || "",
          bgcolor: product.bgcolor || "#ffffff",
          panelcolor: product.panelcolor || "#f0f0f0",
          textcolor: product.textcolor || "#000000",
          details: product.details || "",
          information: product.information || "",
          image: product.image || null,
        });
      } catch (err) {
        console.error("Error fetching product:", err.message);
        setError("Failed to load product details");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" ? value.charAt(0).toUpperCase() + value.slice(1) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await Swal.fire({
        title: `Save Changes?`,
        text: `Update details for "${formData.name}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0f172a",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Yes, Update",
        cancelButtonText: "Cancel",
        customClass: {
          popup: "rounded-3xl font-sans bg-white text-slate-900 border border-slate-200 shadow-2xl",
        },
      });

      if (!result.isConfirmed) return;
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/owner/EditProduct/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess(res.data.message || "Product updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async () => {
    try {
      const result = await Swal.fire({
        title: `Delete Product?`,
        text: `Are you sure you want to permanently remove "${formData.name}" from catalog?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Keep Product",
        customClass: {
          popup: "rounded-3xl font-sans bg-white text-slate-900 border border-slate-200 shadow-2xl",
        },
      });

      if (!result.isConfirmed) return;

      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/owner/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(`Product deleted successfully!`);
      navigate(-1);

    } catch (error) {
      toast.error(`Could not delete item.`);
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen flex flex-col justify-between font-sans">
      <div>
        <OwnerNavbar />

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Edit Product Listing
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Modify pricing, description, specifications, and model details.
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 space-y-6 shadow-sm">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-semibold">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <Check size={16} />
                <span>{success}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1.5">Product Title</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Regular Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Discounted Price (₹)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1.5">Product Details</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium h-24 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1.5">Technical Specifications</label>
                <textarea
                  name="information"
                  value={formData.information}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium h-24 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleRemoveItem}
                className="py-3 px-6 rounded-2xl text-xs font-extrabold bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                <span>Delete Product</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-slate-900 hover:bg-slate-800 text-white flex-1 py-3 text-xs font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{loading ? "Saving Changes..." : "Save Product Changes"}</span>
              </button>
            </div>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ItemsEdit;
