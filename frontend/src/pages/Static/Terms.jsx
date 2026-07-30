import React from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Terms = () => {
  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full">
        <div className="apple-card p-8 sm:p-12 bg-white space-y-8 shadow-xl">
          <div className="border-b border-black/10 pb-6 text-center space-y-2">
            <span className="text-xs font-semibold text-[#86868b] uppercase tracking-widest">Legal Agreement</span>
            <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">Terms &amp; Conditions</h1>
            <p className="text-xs text-[#86868b]">Rules, guidelines, and agreements for using Shop Mart services.</p>
          </div>

          <div className="space-y-4 text-sm text-[#515154] leading-relaxed">
            <p>
              By accessing and using this website, you agree to comply with and be bound by the following terms and conditions of use:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>All store content, pricing, and specs are for general informational purposes.</li>
              <li>Unauthorized access or reproduction of site materials is prohibited.</li>
              <li>Product availability and discounts are subject to change without prior notice.</li>
              <li>All payments are final and non-refundable unless specified under warranty terms.</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-black/5 flex justify-between items-center text-xs text-[#86868b]">
            <span>Shop Mart Legal Framework</span>
            <a href="mailto:vishubbkup@gmail.com" className="text-[#0071e3] font-semibold hover:underline">
              Legal Desk Contact
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;

