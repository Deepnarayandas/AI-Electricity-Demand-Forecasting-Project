import { Link } from "react-router-dom";
import { Zap, Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

      {/* Nav hint */}
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-200 bg-white">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
          <Zap size={14} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="text-sm font-bold tracking-widest uppercase text-slate-700">ElectraForecast</span>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-61px)] px-4 text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-6">
          <AlertTriangle size={28} className="text-amber-500" />
        </div>

        {/* 404 */}
        <div className="mb-2">
          <span className="text-8xl font-extrabold text-slate-200 tracking-tight select-none">404</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">Page not found</h1>
        <p className="text-slate-500 text-sm mb-8 max-w-sm">
          The page you're looking for doesn't exist or may have been moved to a different location.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm shadow-blue-200 transition-all hover:scale-105"
          >
            <Home size={14} />
            Go to home
          </Link>
          <Link
            to="/model"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 shadow-sm transition-all"
          >
            <Zap size={14} className="text-amber-500" />
            Start prediction
          </Link>
        </div>

        {/* Decorative grid card */}
        <div className="mt-14 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm w-full max-w-sm">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-3">System Status</p>
          <div className="space-y-2.5">
            {[
              { label: "Forecast Engine", status: "Operational", ok: true },
              { label: "Data Pipeline", status: "Operational", ok: true },
              { label: "This Page", status: "Not Found", ok: false },
            ].map(({ label, status, ok }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{label}</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full
                  ${ok ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-red-500"}`} />
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}