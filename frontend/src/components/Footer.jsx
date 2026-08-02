import { Link } from "react-router-dom";
import { ShieldCheck, Truck, RotateCcw, CreditCard } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-[#f5f5f7] border-t border-black/10 pt-12 pb-8 mt-20 text-[#86868b] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Apple Value Props Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-black/10 text-center">
          <div className="flex flex-col items-center">
            <Truck size={24} className="text-[#1d1d1f] mb-2" />
            <span className="font-semibold text-[#1d1d1f] text-sm">Free Delivery</span>
            <span className="text-xs">On all orders nationwide</span>
          </div>
          <div className="flex flex-col items-center">
            <RotateCcw size={24} className="text-[#1d1d1f] mb-2" />
            <span className="font-semibold text-[#1d1d1f] text-sm">Easy Returns</span>
            <span className="text-xs">7 days hassle-free policy</span>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck size={24} className="text-[#1d1d1f] mb-2" />
            <span className="font-semibold text-[#1d1d1f] text-sm">100% Authentic</span>
            <span className="text-xs">Direct from verified brands</span>
          </div>
          <div className="flex flex-col items-center">
            <CreditCard size={24} className="text-[#1d1d1f] mb-2" />
            <span className="font-semibold text-[#1d1d1f] text-sm">Secure Payment</span>
            <span className="text-xs">Encrypted checkout options</span>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="py-6 border-b border-black/10 leading-relaxed text-[#86868b]">
          <p>
            * Prices include applicable taxes. Standard terms and conditions apply. All trademarks and logos belong to their respective owners.
          </p>
        </div>

        {/* Footer Navigation & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-[#1d1d1f]">
            <Logo size="sm" showText={false} variant="dark" />
            <span className="font-medium text-xs text-[#1d1d1f]">Copyright © {new Date().getFullYear()} Shop Mart Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[#515154]">
            <Link to="/terms" className="hover:text-[#0071e3] transition">Terms of Use</Link>
            <span className="text-gray-300">|</span>
            <Link to="/privacy" className="hover:text-[#0071e3] transition">Privacy Policy</Link>
            <span className="text-gray-300">|</span>
            <Link to="/refund" className="hover:text-[#0071e3] transition">Sales & Refunds</Link>
            <span className="text-gray-300">|</span>
            <Link to="/shipping" className="hover:text-[#0071e3] transition">Legal & Shipping</Link>
            <span className="text-gray-300">|</span>
            <Link to="/contact" className="hover:text-[#0071e3] transition">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

