import { motion } from "framer-motion";
import { Smartphone, Download, Apple, QrCode, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { FaAndroid, FaApple } from "react-icons/fa";

const MobileAppBanner = () => {
  const handleAndroidDownload = () => {
    // Triggers download or redirects to APK link / Expo web
    window.open("http://localhost:8081", "_blank");
  };

  const handleIosDownload = () => {
    // Opens iOS App / Expo link
    window.open("http://localhost:8081", "_blank");
  };

  return (
    <section className="my-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white p-8 sm:p-12 shadow-2xl border border-slate-700/60"
      >
        {/* Glow Decor Background elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase">
              <Sparkles size={14} className="text-blue-400 animate-pulse" />
              <span>SHOP MART MOBILE APP</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Shopping in your pocket. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                Faster. Smarter. Seamless.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Get the official Shop Mart application for Android and iPhone. Track orders live, access exclusive in-app coins, talk with our Genius AI Shopping Assistant, and enjoy express 1-tap checkout.
            </p>

            {/* App Features List */}
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-slate-200 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Live Order Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Genius AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Instant In-App Offers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Seller & Customer Mode</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {/* Android Download Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAndroidDownload}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 border border-emerald-400/30 hover:from-emerald-500 hover:to-teal-500 transition"
              >
                <FaAndroid className="text-xl" />
                <div className="text-left">
                  <div className="text-[10px] uppercase font-semibold text-emerald-200 leading-none">Download For</div>
                  <div className="text-sm font-black leading-tight">Android (.APK)</div>
                </div>
                <Download size={16} className="ml-1" />
              </motion.button>

              {/* iOS Download Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleIosDownload}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm shadow-lg shadow-slate-950/40 border border-slate-600/80 transition"
              >
                <FaApple className="text-xl" />
                <div className="text-left">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 leading-none">Available on</div>
                  <div className="text-sm font-black leading-tight">iPhone / App Store</div>
                </div>
                <Download size={16} className="ml-1" />
              </motion.button>
            </div>
          </div>

          {/* Phone Screen & QR Mockup Column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative p-6 rounded-3xl bg-slate-800/80 backdrop-blur-xl border border-slate-700 shadow-2xl text-center w-full max-w-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-400/30 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <QrCode size={26} />
              </div>
              <h3 className="text-white font-bold text-base">Scan to Install</h3>
              <p className="text-slate-400 text-xs mt-1">Scan QR code with your mobile camera to test app instantly</p>

              <div className="my-4 p-3 bg-white rounded-2xl shadow-inner inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    "http://localhost:8081"
                  )}`}
                  alt="Shop Mart App QR Code"
                  className="w-32 h-32 mx-auto rounded-lg"
                />
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Verified Safe & Virus-Free</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default MobileAppBanner;
