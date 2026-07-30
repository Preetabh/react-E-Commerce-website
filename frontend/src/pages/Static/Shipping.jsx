import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Truck } from "lucide-react";

const Shipping = () => {
  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full">
        <div className="apple-card p-8 sm:p-12 bg-white space-y-8 shadow-xl">
          <div className="border-b border-black/10 pb-6 text-center space-y-2">
            <span className="text-xs font-semibold text-[#0071e3] uppercase tracking-widest flex items-center justify-center gap-1">
              <Truck size={14} /> Express Courier Logistics
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">Shipping Policy</h1>
            <p className="text-xs text-[#86868b]">Information about express courier delivery and dispatch timelines.</p>
          </div>

          <div className="space-y-4 text-sm text-[#515154] leading-relaxed">
            <p>
              We process and ship all device orders within 1 to 3 business days following payment authorization or COD verification.
            </p>
            <p>
              Delivery timelines may vary depending on your location. Once your order is processed, tracking updates will be communicated directly via SMS &amp; Email.
            </p>
            <p>
              If there is a delay in delivery or a logistics query, contact customer service at{" "}
              <a href="mailto:vishubbkup@gmail.com" className="text-[#0071e3] font-semibold hover:underline">
                vishubbkup@gmail.com
              </a>.
            </p>
          </div>

          <div className="pt-4 border-t border-black/5 flex justify-between items-center text-xs text-[#86868b]">
            <span>Shop Mart Logistics Partner Network</span>
            <span className="font-semibold text-[#1d1d1f]">Updated: July 2025</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shipping;

