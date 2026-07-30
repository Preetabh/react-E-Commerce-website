import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OwnerNavbar from "../../components/OwnerNavbar.jsx";
import Footer from "../../components/Footer.jsx";
import { Package, Edit3, ArrowRight } from "lucide-react";
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
    <div className="bg-[#0f0f11] text-[#f5f5f7] min-h-screen flex flex-col justify-between font-sans">
      <div>
        <OwnerNavbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Store Inventory Management
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                View, edit pricing, and update product cards in your store catalog.
              </p>
            </div>

            <button
              onClick={() => navigate("/owner/add-product")}
              className="apple-btn-primary py-2.5 px-5 text-xs font-semibold flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <span>+ Add New Product</span>
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400 mt-4">Loading catalog items...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="apple-card-dark p-6 bg-white/5 border border-white/10 flex flex-col justify-between hover:border-white/20 transition group"
                >
                  <div>
                    <div className="w-full h-44 bg-white/5 rounded-2xl p-4 flex items-center justify-center mb-4 border border-white/5 overflow-hidden">
                      <img
                        src={item.images?.[0]?.url || "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <h3 className="text-base font-bold text-white line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>

                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-lg font-extrabold text-blue-400">
                        ₹{Number(item.discount || item.price).toLocaleString("en-IN")}
                      </span>
                      {item.discount && (
                        <span className="text-xs text-gray-500 line-through">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/owner/EditProduct/${item._id}`)}
                    className="mt-6 w-full py-2.5 px-4 bg-white/10 hover:bg-blue-600 text-white text-xs font-semibold rounded-full border border-white/10 transition flex items-center justify-center gap-2"
                  >
                    <Edit3 size={14} />
                    <span>Edit Product Details</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <Package size={36} className="mx-auto mb-3 text-gray-600" />
              <p className="text-sm">No products found in store inventory.</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AllItems;

