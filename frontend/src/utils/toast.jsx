import { toast } from "react-toastify";
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import React from "react";

export const classyToast = {
  success: (msg) =>
    toast.success(
      <div className="flex items-center gap-2.5">
        <CheckCircle2 size={18} className="text-emerald-400 shrink-0 animate-bounce" />
        <span className="font-extrabold text-[#f8fafc]">{msg}</span>
      </div>,
      {
        icon: false,
      }
    ),
  error: (msg) =>
    toast.error(
      <div className="flex items-center gap-2.5">
        <AlertCircle size={18} className="text-rose-400 shrink-0" />
        <span className="font-extrabold text-[#f8fafc]">{msg}</span>
      </div>,
      {
        icon: false,
      }
    ),
  info: (msg) =>
    toast.info(
      <div className="flex items-center gap-2.5">
        <Info size={18} className="text-cyan-400 shrink-0" />
        <span className="font-extrabold text-[#f8fafc]">{msg}</span>
      </div>,
      {
        icon: false,
      }
    ),
  warning: (msg) =>
    toast.warning(
      <div className="flex items-center gap-2.5">
        <AlertTriangle size={18} className="text-amber-400 shrink-0 animate-pulse" />
        <span className="font-extrabold text-[#f8fafc]">{msg}</span>
      </div>,
      {
        icon: false,
      }
    ),
};

export default classyToast;
