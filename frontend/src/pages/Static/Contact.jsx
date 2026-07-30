import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Mail, Phone, Clock, MessageSquare } from "lucide-react";

const Contact = () => {
  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full">
        <div className="apple-card p-8 sm:p-12 bg-white space-y-8 shadow-xl">
          <div className="border-b border-black/10 pb-6 text-center space-y-2">
            <span className="text-xs font-semibold text-[#86868b] uppercase tracking-widest">Customer Care</span>
            <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">Contact Shop Mart Support</h1>
            <p className="text-xs text-[#86868b]">We're here to assist you with order inquiries and device support.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-[#f5f5f7] rounded-2xl border border-black/5 flex items-start gap-4">
              <div className="p-3 bg-white text-[#0071e3] rounded-xl shadow-sm">
                <Mail size={22} />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block">Email Assistance</span>
                <a href="mailto:vishubbkup@gmail.com" className="text-sm font-bold text-[#0071e3] hover:underline mt-1 block">
                  vishubbkup@gmail.com
                </a>
              </div>
            </div>

            <div className="p-6 bg-[#f5f5f7] rounded-2xl border border-black/5 flex items-start gap-4">
              <div className="p-3 bg-white text-[#0071e3] rounded-xl shadow-sm">
                <Phone size={22} />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block">Phone Helpline</span>
                <a href="tel:+919452900378" className="text-sm font-bold text-[#1d1d1f] mt-1 block">
                  +91 94529 00378
                </a>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-3 text-xs text-[#515154]">
            <Clock size={18} className="text-[#0071e3] shrink-0" />
            <span>Our support team responds to all customer requests within 24 to 48 business hours.</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

