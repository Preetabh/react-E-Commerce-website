import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OwnerNavbar from "../../components/OwnerNavbar.jsx";
import Footer from "../../components/Footer.jsx";
import Swal from "sweetalert2";
import { X, Check, PackageCheck } from "lucide-react";
import "../../App.css";

const AllOrdersShow = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setOrders(response.data.orders);
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
      confirmButtonColor: "#0071e3",
      cancelButtonColor: "#1d1d1f",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'rounded-3xl font-sans bg-[#1d1d1f] text-white',
      }
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

  return (
    <div className="bg-[#0f0f11] text-[#f5f5f7] min-h-screen flex flex-col justify-between font-sans">
      <div>
        <OwnerNavbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Customer Order Dispatch
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Monitor incoming customer device orders, track fulfillment, and update delivery status.
              </p>
            </div>
            <div className="text-xs font-semibold text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              Total Orders: {orders.length}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400 mt-4">Fetching order queue...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="apple-card-dark p-6 bg-white/5 border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider bg-white/5">
                      <th className="py-3 px-4 rounded-l-xl">Customer</th>
                      <th className="py-3 px-4">Contact Info</th>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Order Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 rounded-r-xl text-right">Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((order, index) => (
                      <tr key={index} className="hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          {order.userName}
                        </td>
                        <td className="py-3.5 px-4 text-gray-400">
                          <div>{order.email}</div>
                          <div className="text-[11px] text-gray-500">+91 {order.contact}</div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-gray-200 line-clamp-1 max-w-[200px]">
                          {order.orderName}
                        </td>
                        <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === "completed"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : order.status === "cancelled"
                                ? "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
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
                                className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white transition"
                                title="Mark Completed"
                              >
                                <Check size={14} />
                              </button>
                            )}
                            {order.status !== "cancelled" && (
                              <button
                                onClick={() => updateOrderStatus(order.orderId, "cancelled")}
                                className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition"
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
            <div className="text-center py-20 text-gray-500">
              <PackageCheck size={36} className="mx-auto mb-3 text-gray-600" />
              <p className="text-sm">No customer orders have been placed yet.</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AllOrdersShow;

