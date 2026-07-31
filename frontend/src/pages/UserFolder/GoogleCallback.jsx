import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GridScan from "../../components/GridScan.jsx";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      toast.success("Google Sign In Successful!", { autoClose: 1500 });
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } else {
      toast.error("Google authentication failed. Please try again.");
      setTimeout(() => {
        navigate("/users/login");
      }, 2000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen w-full bg-[#070a13] text-[#f5f5f7] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-80">
        <GridScan
          sensitivity={0.3}
          lineThickness={1}
          linesColor="#161b26"
          gridScale={0.12}
          scanColor="#0071e3"
          scanOpacity={0.5}
          enablePost={false}
          scanDuration={3.0}
        />
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="apple-card p-8 bg-white/90 backdrop-blur-2xl text-[#1d1d1f] shadow-2xl space-y-4 text-center border border-white/20 z-10 max-w-sm w-full">
        <div className="w-12 h-12 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <h2 className="text-xl font-bold">Authenticating with Google...</h2>
        <p className="text-xs text-[#86868b]">Please wait while we log you into Shop Mart.</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
