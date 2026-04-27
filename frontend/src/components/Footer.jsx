import { Link } from "react-router-dom";
import { Zap, Mail, Phone, MapPin, Github } from "lucide-react";

export default function Footer() {
  const links = ["Home", "Model", "Appliance", "History", "About Us", "Contact"];
  const routes = ["/", "/model", "/appliance", "/history", "/about", "/contact"];

  const features = [
    "Real-Time Prediction",
    "Weather Auto Fetch",
    "Appliance Prediction",
    "Secure Login System",
    "Prediction History",
  ];

  return (
    <footer
  className="text-slate-400 text-sm"
  style={{
    backgroundColor: "#f0f6ff",
    backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)",
    backgroundSize: "28px 28px",
  }}
>
      {/* TOP BAR */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.5fr] gap-8 py-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Zap size={22} className="text-amber-400" />
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                AI Electricity Forecast
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Smart grid system using AI to predict electricity demand, detect peak loads, analyze appliance energy consumption, estimate household usage, and visualize power trends in real time.
            </p>

            <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-[11px] font-bold tracking-widest uppercase">
              <Zap size={11} className="text-amber-400" />
              Powered by XGBoost + LSTM
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-amber-500 mb-3">
              Quick Links
            </p>

            <ul className="flex flex-col gap-2">
              {links.map((l, i) => (
                <li key={l}>
                  <Link
                    to={routes[i]}
                    className="flex items-center gap-2 text-xs text-slate-400 hover:text-blue-600 transition-colors group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-amber-400 transition-colors" />
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-amber-500 mb-3">
              Features
            </p>

            <div className="flex flex-col gap-2">
              {features.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-2 text-xs text-slate-400"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-200 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-amber-500 mb-3">
              Contact
            </p>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2.5 shadow-sm">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "electraforecast@gmail.com",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+91 9749517191",
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: "Punjab, India",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                    <Icon size={12} className="text-blue-500" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                      {label}
                    </p>
                    <p className="text-xs text-slate-400">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-3">
              {[Github].map((Icon, i) => (
                <a
                  key={i}
                  href="https://github.com/Deepnarayandas/AI-Electricity-Demand-Forecasting-Project"
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-200 flex items-center justify-between py-3 flex-wrap gap-3">
          <p className="text-xs text-slate-300">
            © 2026{" "}
            <span className="text-slate-400 font-semibold">
              AI Based Electricity Demand Forecast Prediction.
            </span>{" "}
            All Rights Reserved.
          </p>

          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}