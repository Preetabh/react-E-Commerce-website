import React from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Refund = () => {
  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full">
        <div className="apple-card p-8 sm:p-12 bg-white space-y-8 shadow-xl">
          <div className="border-b border-black/10 pb-6 text-center space-y-2">
            <span className="text-xs font-semibold text-[#86868b] uppercase tracking-widest">Returns Policy</span>
            <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">Refund &amp; Cancellation Policy</h1>
            <p className="text-xs text-[#86868b]">Our terms regarding device purchases and order cancellations.</p>
          </div>

          <div className="space-y-4 text-sm text-[#515154] leading-relaxed">
            <p>
              All sales made through our website are final once processed. We do not offer refunds or cancellations once a device model has been dispatched for delivery.
            </p>
            <p>
              Please make sure to review product specifications and storage options carefully before confirming your payment.
            </p>
            <p>
              For questions or support regarding payment disputes, reach out to our team at{" "}
              <a href="mailto:vishubbkup@gmail.com" className="text-[#0071e3] font-semibold hover:underline">
                vishubbkup@gmail.com
              </a>.
            </p>
          </div>

          <div className="pt-4 border-t border-black/5 flex justify-between items-center text-xs text-[#86868b]">
            <span>Shop Mart Quality Guarantee</span>
            <span className="font-semibold text-[#1d1d1f]">Updated: July 2025</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Refund;

