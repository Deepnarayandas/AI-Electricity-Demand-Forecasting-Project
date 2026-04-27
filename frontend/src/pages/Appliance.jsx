import { useState } from "react";
import axios from "axios";
import { Zap, Loader2 } from "lucide-react";

const appliancesList = {
  ac: { label: "Air Conditioner",  color: "border-blue-200 bg-blue-50" },
  fan: { label: "Fan",  color: "border-cyan-200 bg-cyan-50" },
  heater: { label: "Heater",  color: "border-orange-200 bg-orange-50" },
  tv: { label: "Television", color: "border-slate-200 bg-slate-50" },
  fridge: { label: "Fridge",  color: "border-sky-200 bg-sky-50" },
  light: { label: "Light",  color: "border-amber-200 bg-amber-50" },
};

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";

export default function AppliancePrediction() {
  const [inputs, setInputs] = useState({
    ac: { quantity: 0, hours: 0 },
    fan: { quantity: 0, hours: 0 },
    heater: { quantity: 0, hours: 0 },
    tv: { quantity: 0, hours: 0 },
    fridge: { quantity: 0, hours: 0 },
    light: { quantity: 0, hours: 0 },
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (appliance, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [appliance]: { ...prev[appliance], [field]: Number(value) || 0 },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log("Sending data:", inputs);
    try {
      const res = await axios.post("http://localhost:8000/api/appliance", inputs);
      console.log("Response:", res.data);
      setResult(res.data);
    } catch (err) {
      console.error("ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const levelStyle = {
    High: "text-red-600 bg-red-50 border-red-200",
    Medium: "text-amber-600 bg-amber-50 border-amber-200",
    Low: "text-emerald-600 bg-emerald-50 border-emerald-200",
  };

  return (
    <div className="min-h-screen text-slate-900" style={{ backgroundColor: "#f0f6ff", backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)", backgroundSize: "28px 28px" }}>

      {/* TOP ACCENT */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

      <div className="max-w-5xl mx-auto px-5 py-14">

        {/* HEADER */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-2">Usage Calculator</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
            Appliance Energy Prediction
          </h1>
          <p className="text-slate-500 text-sm">
            Enter the quantity and daily usage hours for each appliance to estimate total energy consumption.
          </p>
        </div>

        {/* INPUT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Object.keys(appliancesList).map((key) => {
            const { label, icon, color } = appliancesList[key];
            return (
              <div
                key={key}
                className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow ${color}`}
              >
                {/* Card Header */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{icon}</span>
                  <h3 className="font-bold text-slate-800 text-sm">{label}</h3>
                </div>

                {/* Quantity */}
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Quantity</label>
                  <input
                    type="number"
                    placeholder="e.g. 2"
                    className={inputClass}
                    onChange={(e) => handleChange(key, "quantity", e.target.value)}
                  />
                </div>

                {/* Hours */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Hours Used / Day</label>
                  <input
                    type="number"
                    placeholder="e.g. 8"
                    className={inputClass}
                    onChange={(e) => handleChange(key, "hours", e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm shadow-md shadow-blue-200 flex items-center justify-center gap-2 transition-all"
        >
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Calculating…</>
            : <><Zap size={16} className="text-amber-300" /> Predict Energy Usage</>}
        </button>

        {/* RESULT */}
        {result && (
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-7 shadow-md">

            <p className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-5">Energy Report</p>

            {/* Total + Level */}
            <div className="flex flex-wrap items-center gap-5 mb-7">
              <div>
                <p className="text-xs text-slate-400 font-semibold mb-1">Total Energy Consumption</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-slate-900">{result.totalEnergy}</span>
                  <span className="text-lg font-semibold text-slate-400 mb-0.5">kWh</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold mb-1">Load Level</p>
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-bold ${levelStyle[result.level] || "text-slate-600 bg-slate-50 border-slate-200"}`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    result.level === "High" ? "bg-red-500" : result.level === "Medium" ? "bg-amber-500" : "bg-emerald-500"
                  }`} />
                  {result.level}
                </span>
              </div>
            </div>

            {/* Breakdown */}
            <div>
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">Breakdown by Appliance</p>
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                {result.details?.map((item, index) => {
                  const info = appliancesList[item.appliance] || {};
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between px-5 py-3 text-sm border-b border-slate-100 last:border-0 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{info.icon || "🔌"}</span>
                        <span className="font-semibold text-slate-700 capitalize">{item.appliance}</span>
                      </div>
                      <span className="font-bold text-slate-900">{item.energy} <span className="text-slate-400 font-normal">kWh</span></span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}