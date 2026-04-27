import { useEffect, useState } from "react";
import { Zap, Clock, TrendingUp, Activity, AlertCircle } from "lucide-react";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("predictionHistory")) || [];
    setHistory(stored);
  }, []);

  return (
    <div className="min-h-screen text-slate-800 font-sans" style={{ backgroundColor: "#f0f6ff", backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)", backgroundSize: "28px 28px" }}>

      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs font-bold tracking-widest text-amber-500 uppercase">ElectraForecast</p>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Prediction History</h1>
          <p className="text-slate-500 text-sm mt-1">All past electricity demand forecasts</p>
        </div>

        {/* Summary Cards */}
        {history.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Total Records</p>
              <p className="text-2xl font-bold text-slate-900">{history.length}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Latest Demand</p>
              <p className="text-2xl font-bold text-slate-900">
                {history[0]?.demand ?? "—"} <span className="text-sm font-normal text-slate-500">MW</span>
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm col-span-2 md:col-span-1">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Last Updated</p>
              <p className="text-sm font-semibold text-slate-700">{history[0]?.date ?? "—"}</p>
            </div>
          </div>
        )}

        {/* History Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Table Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Clock size={15} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">Forecast Log</p>
                <p className="text-xs text-slate-400">{history.length} record{history.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <AlertCircle size={22} className="text-slate-400" />
              </div>
              <p className="font-semibold text-slate-700 mb-1">No predictions yet</p>
              <p className="text-sm text-slate-400 max-w-xs">
                Run your first forecast from the prediction model page to see results here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Activity size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-800 text-sm">Forecast #{history.length - index}</p>
                        {index === 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wide">
                            Latest
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp size={13} className="text-blue-500" />
                    <span className="font-bold text-slate-800 text-sm">{item.demand} MW</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}