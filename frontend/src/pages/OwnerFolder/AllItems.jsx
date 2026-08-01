import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OwnerNavbar from "../../components/OwnerNavbar.jsx";
import Footer from "../../components/Footer.jsx";
import { Package, Edit3, PlusCircle } from "lucide-react";
import "../../App.css";

const AllItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/owner/dashboard`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setItems(response.data.reverseProducts || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen flex flex-col justify-between font-sans">
      <div>
        <OwnerNavbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Store Inventory Management
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                View, edit pricing, manage stock, and update catalog products in your store.
              </p>
            </div>

            <button
              onClick={() => navigate("/owner/Add-Items")}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 py-2.5 px-5 text-xs font-extrabold rounded-2xl shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto transition-colors"
            >
              <PlusCircle size={16} />
              <span>Add New Product</span>
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
              <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-500 mt-4 font-semibold">Loading inventory items...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition group"
                >
                  <div>
                    <div className="w-full h-48 bg-slate-50 rounded-2xl p-4 flex items-center justify-center mb-4 border border-slate-100 overflow-hidden">
                      <img
                        src={item.images?.[0]?.url || "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
                          e.target.onerror = null;
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {item.category || "General"}
                      </span>
                      {item.sku && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.sku}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 line-clamp-2 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-medium">{item.details || item.information || "No description provided."}</p>

                    <div className="flex items-baseline gap-2 mt-4">
                      <span className="text-lg font-black text-slate-900">
                        ₹{Number(item.discount || item.price).toLocaleString("en-IN")}
                      </span>
                      {item.discount && item.discount < item.price && (
                        <span className="text-xs text-slate-400 line-through font-semibold">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/owner/EditProduct/${item._id}`)}
                    className="mt-6 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                  >
                    <Edit3 size={14} />
                    <span>Edit Product Details</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <Package size={36} className="mx-auto mb-3 text-slate-400" />
              <p className="text-sm font-semibold">No products found in store inventory.</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AllItems;
