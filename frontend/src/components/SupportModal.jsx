import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Zap,
  HelpCircle,
  Cloud,
  Cpu,
  ShieldCheck,
  User,
  ChevronDown,
  Mail,
} from "lucide-react";

const block1Items = [
  {
    id: "b1-0",
    icon: Cpu,
    q: "How does electricity prediction work?",
    a: "AI uses historical data + weather to forecast demand.",
  },
  {
    id: "b1-1",
    icon: Cloud,
    q: "Why weather matters?",
    a: "Temperature affects electricity usage heavily.",
  },
];

const block2Items = [
  {
    id: "b2-0",
    icon: HelpCircle,
    q: "Prediction not showing?",
    a: "Check inputs or refresh dashboard.",
  },
  {
    id: "b2-1",
    icon: User,
    q: "View past predictions?",
    a: "Yes, available in dashboard history.",
  },
  {
    id: "b2-2",
    icon: ShieldCheck,
    q: "Is data secure?",
    a: "Yes, encrypted and safe.",
  },
];

const FAQItem = ({ item, openId, setOpenId }) => {
  const Icon = item.icon;
  const isOpen = openId === item.id;

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-shadow hover:shadow-sm">
      <div
        onClick={() => setOpenId(isOpen ? null : item.id)}
        className="flex items-center px-3 py-2.5 cursor-pointer hover:bg-slate-50 transition-colors gap-2.5"
      >
        <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
          <Icon size={11} className="text-blue-600" />
        </div>
        <span className="flex-1 text-sm text-slate-700 font-medium">{item.q}</span>
        <ChevronDown
          size={13}
          className={`text-slate-400 transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180 text-blue-500" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="px-3 pb-2.5 ml-9 text-sm text-slate-500 leading-relaxed border-t border-slate-100">
          <p className="pt-2">{item.a}</p>
        </div>
      )}
    </div>
  );
};

const SupportModal = ({ close }) => {
  const panelRef = useRef();
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm">
      <div
        ref={panelRef}
        className="absolute top-16 right-4 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
        style={{ animation: "slideDown 0.2s ease-out" }}
      >
        {/* Top accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Zap size={13} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 leading-none">Support Center</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">How can we help?</p>
            </div>
          </div>
          <button
            onClick={close}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
          >
            <X size={13} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="px-4 py-3 space-y-3 max-h-[70vh] overflow-y-auto">

          {/* CONTACT */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Mail size={12} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900 leading-none">Need direct help?</p>
              <p className="text-[11px] text-blue-600 mt-0.5">electraforecast@gmail.com</p>
            </div>
          </div>

          {/* QUICK HELP */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Quick Help
            </p>
            <div className="space-y-1.5">
              {block1Items.map((item) => (
                <FAQItem key={item.id} item={item} openId={openId} setOpenId={setOpenId} />
              ))}
            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-slate-100" />

          {/* FAQ */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              FAQs
            </p>
            <div className="space-y-1.5">
              {block2Items.map((item) => (
                <FAQItem key={item.id} item={item} openId={openId} setOpenId={setOpenId} />
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-center gap-1.5 py-2 border-t border-slate-100 bg-slate-50">
          <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center">
            <Zap size={9} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">
            ElectraForecast
          </span>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SupportModal;