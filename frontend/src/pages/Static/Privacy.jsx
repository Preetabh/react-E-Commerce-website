import React from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ShieldCheck, Lock } from "lucide-react";

const Privacy = () => {
  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full">
        <div className="apple-card p-8 sm:p-12 bg-white space-y-8 shadow-xl">
          <div className="border-b border-black/10 pb-6 text-center space-y-2">
            <span className="text-xs font-semibold text-[#0071e3] uppercase tracking-widest flex items-center justify-center gap-1">
              <ShieldCheck size={14} /> Security &amp; Trust
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">Privacy Policy</h1>
            <p className="text-xs text-[#86868b]">How we protect and handle your customer account data.</p>
          </div>

          <div className="space-y-4 text-sm text-[#515154] leading-relaxed">
            <p>
              We respect your privacy. Any personal information shared with us, including name, email, phone, and address, will be kept strictly confidential.
            </p>
            <p>
              We do not share or sell user data to third parties. Payment data is securely processed via encrypted payment gateway partners.
            </p>
            <p>
              We may collect cookies and anonymous analytics to improve page load speeds and personalize your store recommendations.
            </p>
          </div>

          <div className="pt-4 border-t border-black/5 flex justify-between items-center text-xs text-[#86868b]">
            <span>&copy; Shop Mart Privacy Standard</span>
            <span className="font-semibold text-[#1d1d1f]">Updated: July 2025</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;

