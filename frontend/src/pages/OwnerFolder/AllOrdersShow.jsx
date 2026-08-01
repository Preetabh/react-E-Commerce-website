import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OwnerNavbar from "../../components/OwnerNavbar.jsx";
import Footer from "../../components/Footer.jsx";
import Swal from "sweetalert2";
import { X, Check, PackageCheck, ArrowUpDown } from "lucide-react";
import "../../App.css";

const AllOrdersShow = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newToOld"); // "newToOld" or "oldToNew"

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/owner/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setOrders(response.data.orders || []);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/owner/login");
        }
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const updateOrderStatus = async (orderId, newStatus) => {
    const result = await Swal.fire({
      title: `Mark order as ${newStatus}?`,
      text: `Update status for order #${orderId.slice(-6)}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0f172a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-3xl font-sans bg-white text-slate-900 border border-slate-200 shadow-2xl",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/owner/orders/update-status`,
        { orderId, status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );

      Swal.fire("Success", `Order status set to ${newStatus}`, "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Update failed", "error");
    }
  };

  // Sort orders based on selected format (newToOld vs oldToNew)
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.orderDate || 0).getTime();
    const dateB = new Date(b.orderDate || 0).getTime();
    return sortOrder === "newToOld" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen flex flex-col justify-between font-sans">
      <div>
        <OwnerNavbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Customer Order Dispatch
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Monitor incoming customer device orders, track fulfillment, and update delivery status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Order Sort Selector */}
              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-xs">
                <ArrowUpDown size={14} className="text-slate-500" />
                <span className="text-xs font-bold text-slate-500">Order Format:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent text-xs font-extrabold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="newToOld">Newest to Oldest (New → Old)</option>
                  <option value="oldToNew">Oldest to Newest (Old → New)</option>
                </select>
              </div>

              <div className="text-xs font-extrabold text-slate-700 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
                Total Orders: {orders.length}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
              <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-500 mt-4 font-semibold">Fetching order queue...</p>
            </div>
          ) : sortedOrders.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider bg-slate-50">
                      <th className="py-3 px-4 rounded-l-xl">Customer</th>
                      <th className="py-3 px-4">Contact Info</th>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Order Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 rounded-r-xl text-right">Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedOrders.map((order, index) => (
                      <tr key={index} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">
                          {order.userName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="font-semibold">{order.email}</div>
                          <div className="text-[11px] text-slate-400 font-mono">+91 {order.contact}</div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800 line-clamp-1 max-w-[200px]">
                          {order.orderName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                          {new Date(order.orderDate).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              order.status === "completed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : order.status === "cancelled"
                                ? "bg-slate-100 text-slate-600 border border-slate-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex gap-2 justify-end">
                            {order.status !== "completed" && (
                              <button
                                onClick={() => updateOrderStatus(order.orderId, "completed")}
                                className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition"
                                title="Mark Completed"
                              >
                                <Check size={14} />
                              </button>
                            )}
                            {order.status !== "cancelled" && (
                              <button
                                onClick={() => updateOrderStatus(order.orderId, "cancelled")}
                                className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition"
                                title="Cancel Order"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <PackageCheck size={36} className="mx-auto mb-3 text-slate-400" />
              <p className="text-sm font-semibold">No customer orders have been placed yet.</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AllOrdersShow;
