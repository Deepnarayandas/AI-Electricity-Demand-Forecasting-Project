// import { useState, useEffect } from "react";
// import { Zap, MapPin, Loader2 } from "lucide-react";
// import { toast } from "react-toastify";

// <div className="min-h-screen text-slate-900 font-sans relative" style={{ backgroundColor: "#f0f6ff", backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)", backgroundSize: "28px 28px" }}></div>

// const alarmSound = new Audio("/warning.mp3");

// const inputFields = [
//   { name: "temp", label: "Temperature", unit: "°C" },
//   { name: "dwpt", label: "Dew Point", unit: "°C" },
//   { name: "rhum", label: "Humidity", unit: "%" },
//   { name: "wdir", label: "Wind Direction", unit: "°" },
//   { name: "wspd", label: "Wind Speed", unit: "km/h" },
//   { name: "pres", label: "Pressure", unit: "hPa" },
// ];

// const timeFields = [
//   { name: "year", label: "Year", placeholder: "2024" },
//   { name: "month", label: "Month", placeholder: "1–12" },
//   { name: "day", label: "Day", placeholder: "1–31" },
//   { name: "hour", label: "Hour", placeholder: "0–23" },
//   { name: "minute", label: "Minute", placeholder: "0–59" },
// ];

// const inputClass =
//   "w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";

// export default function Model() {
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [loadingWeather, setLoadingWeather] = useState(false);

//   const [form, setForm] = useState({
//     temp: "", dwpt: "", rhum: "", wdir: "", wspd: "", pres: "",
//     year: "", month: "", day: "", hour: "", minute: "", moving_avg_3: ""
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };
// const fetchWeather = async () => {
//   setLoadingWeather(true);

//   navigator.geolocation.getCurrentPosition(
//     async (position) => {
//       try {
//         const lat = position.coords.latitude;
//         const lon = position.coords.longitude;

//         const res = await fetch(
//           `http://127.0.0.1:8000/api/weather?lat=${lat}&lon=${lon}`
//         );

//         const data = await res.json();

//         if (data.error) {
//           toast.error("Backend error");
//           return;
//         }

//         setForm({
//           temp: data.temp,
//           dwpt: data.dwpt,
//           rhum: data.rhum,
//           wdir: data.wdir,
//           wspd: data.wspd,
//           pres: data.pres,
//           year: data.year,
//           month: data.month,
//           day: data.day,
//           hour: data.hour,
//           minute: data.minute,
//           moving_avg_3: data.moving_avg_3,
//         });

//         toast.success("Data auto-filled from your location");
//       } catch (error) {
//         toast.error("Failed to fetch weather");
//       } finally {
//         setLoadingWeather(false);
//       }
//     },
//     () => {
//       toast.error("Location permission denied");
//       setLoadingWeather(false);
//     }
//   );
// };

//   const saveToHistory = (data) => {
//     const existing = JSON.parse(localStorage.getItem("predictionHistory")) || [];
//     const newEntry = { id: Date.now(), demand: data.predicted_power_demand, date: new Date().toLocaleString() };
//     localStorage.setItem("predictionHistory", JSON.stringify([newEntry, ...existing]));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setResult(null);
//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           temp: Number(form.temp), dwpt: Number(form.dwpt), rhum: Number(form.rhum),
//           wdir: Number(form.wdir), wspd: Number(form.wspd), pres: Number(form.pres),
//           year: Number(form.year), month: Number(form.month), day: Number(form.day),
//           hour: Number(form.hour), minute: Number(form.minute), moving_avg_3: Number(form.moving_avg_3),
//         })
//       });
//       const data = await response.json();
//       if (response.ok && data.predicted_power_demand !== undefined) {
//         setResult(data);
//         saveToHistory(data);
//       } else {
//         toast.error(data.error || "Prediction failed");
//       }
//     } catch (error) {
//       toast.error("Server error");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (result) {
//       const isHigh = result.demand_level?.toLowerCase() === "high";
//       const isPeak = result.peak_alert === true;
//       if (isHigh && isPeak) toast.error("Peak Load + High Demand!");
//       else if (isHigh) toast.warning("High Electricity Demand!");
//       else if (isPeak) toast.error("Peak Load Alert!");
//       if (isHigh || isPeak) {
//         alarmSound.pause(); alarmSound.currentTime = 0;
//         alarmSound.play().catch(() => {});
//         setTimeout(() => { alarmSound.pause(); alarmSound.currentTime = 0; }, 4000);
//       }
//     }
//   }, [result]);

//   const sectionClass = "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm";
//   const sectionLabel = "text-xs font-bold tracking-widest uppercase mb-5";

//   return (
//     <div className="min-h-screen text-slate-900" style={{ backgroundColor: "#f0f6ff", backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)", backgroundSize: "28px 28px" }}>
//       {loadingWeather && (
//   <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
//     <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl text-center w-[320px]">

//       {/* 3 Dot Loader */}
//       <div className="flex justify-center gap-2 mb-5">
//         <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></span>
//         <span
//           className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
//           style={{ animationDelay: "0.15s" }}
//         ></span>
//         <span
//           className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
//           style={{ animationDelay: "0.3s" }}
//         ></span>
//       </div>

//       <h2 className="text-lg font-bold text-slate-800">
//         Fetching Weather Data
//       </h2>

//       <p className="text-sm text-slate-500 mt-1">
//         Please wait while we auto-fill inputs...
//       </p>

//     </div>
//   </div>
// )}


//       {/* TOP ACCENT */}
//       <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

//       <div className="max-w-4xl mx-auto px-5 py-14">

//         {/* HEADER */}
//         <div className="mb-10">
//           <p className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-2">AI Prediction Engine</p>
//           <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
//             Electricity Demand Forecast
//           </h1>
//           <p className="text-slate-500 text-sm">
//             Enter environmental and time parameters to forecast electricity load using LSTM + XGBoost.
//           </p>
//         </div>

//         {/* AUTO FETCH */}
//         <div className="flex justify-end mb-5">
//           <button
//             onClick={fetchWeather}
//             disabled={loadingWeather}
//             className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 shadow-sm transition-all disabled:opacity-60"
//           >
//             {loadingWeather
//               ? <><Loader2 size={14} className="animate-spin" /> Fetching…</>
//               : <><MapPin size={14} className="text-blue-500" /> Auto-Fill Weather</>}
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">

//           {/* ATMOSPHERIC */}
// <div className={sectionClass}>
//   <p className={`${sectionLabel} text-blue-600`}>
//     Atmospheric Conditions
//   </p>

//   <div className="grid md:grid-cols-3 gap-4">
//     {inputFields.map(({ name, label, unit, icon }) => (
//       <div key={name}>
//         <label className="block text-xs font-semibold text-slate-500 mb-1.5">
//           {icon} {label}
//         </label>

//         <div className="relative">
//           <input
//             name={name}
//             type="number"
//             value={form[name]}
//             onChange={handleChange}
//             className={`${inputClass} pr-12 [color-scheme:light]`}
//           />

//           {/* UNIT INSIDE BORDER + CLOSE TO BUTTON */}
//           <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-medium pointer-events-none">
//             {unit}
//           </span>
//         </div>
//       </div>
//     ))}
//   </div>
// </div>

//           {/* TIMESTAMP */}
//           <div className={sectionClass}>
//             <p className={`${sectionLabel} text-slate-600`}>Timestamp</p>
//             <div className="grid md:grid-cols-5 gap-4">
//               {timeFields.map(({ name, label, placeholder }) => (
//                 <div key={name}>
//                   <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
//                   <input
//                     name={name} type="number" placeholder={placeholder}
//                     value={form[name]} onChange={handleChange} className={inputClass}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* HISTORICAL SIGNAL */}
//           <div className={sectionClass}>
//             <p className={`${sectionLabel} text-amber-600`}>Historical Signal</p>
//             <div className="max-w-xs">
//               <label className="block text-xs font-semibold text-slate-500 mb-1.5">
//                 Moving Average (last 3 values)
//               </label>
//               <input
//                 name="moving_avg_3" type="number"
//                 placeholder="e.g. 320.5"
//                 value={form.moving_avg_3} onChange={handleChange}
//                 className={inputClass}
//               />
//             </div>
//           </div>

//           {/* SUBMIT */}
//           <button
//             type="submit" disabled={loading}
//             className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm shadow-md shadow-blue-200 flex items-center justify-center gap-2 transition-all"
//           >
//             {loading
//               ? <><Loader2 size={16} className="animate-spin" /> Running Prediction…</>
//               : <><Zap size={16} className="text-amber-300" /> Run Prediction</>}
//           </button>
//         </form>

//         {/* RESULT */}
//         {result && (
//           <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-7 shadow-md">

//             <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4">Prediction Result</p>

//             <div className="flex items-end gap-2 mb-6">
//               <span className="text-5xl font-extrabold text-slate-900">
//                 {result.predicted_power_demand}
//               </span>
//               <span className="text-xl text-slate-400 font-semibold mb-1">{result.unit}</span>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
//                 <p className="text-xs text-slate-400 font-semibold mb-1">Demand Level</p>
//                 <p className={`text-sm font-bold ${
//                   result.demand_level?.toLowerCase() === "high"
//                     ? "text-red-500"
//                     : result.demand_level?.toLowerCase() === "medium"
//                     ? "text-amber-500"
//                     : "text-emerald-500"
//                 }`}>
//                   {result.demand_level}
//                 </p>
//               </div>

//               <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
//                 <p className="text-xs text-slate-400 font-semibold mb-1">Peak Alert</p>
//                 <p className={`text-sm font-bold flex items-center gap-1.5 ${result.peak_alert ? "text-red-500" : "text-emerald-500"}`}>
//                   <span className={`w-2 h-2 rounded-full ${result.peak_alert ? "bg-red-500" : "bg-emerald-500"}`} />
//                   {result.peak_alert ? "Peak Load Detected" : "Normal Operation"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
// );
// }


import { useState, useEffect } from "react";
import { Zap, MapPin, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const alarmSound = new Audio("/warning.mp3");

const inputFields = [
  { name: "temp", label: "Temperature", unit: "°C" },
  { name: "dwpt", label: "Dew Point", unit: "°C" },
  { name: "rhum", label: "Humidity", unit: "%" },
  { name: "wdir", label: "Wind Direction", unit: "°" },
  { name: "wspd", label: "Wind Speed", unit: "km/h" },
  { name: "pres", label: "Pressure", unit: "hPa" },
];

const timeFields = [
  { name: "year", label: "Year", placeholder: "2024" },
  { name: "month", label: "Month", placeholder: "1–12" },
  { name: "day", label: "Day", placeholder: "1–31" },
  { name: "hour", label: "Hour", placeholder: "0–23" },
  { name: "minute", label: "Minute", placeholder: "0–59" },
];

const requiredFields = [
  "temp", "dwpt", "rhum", "wdir", "wspd", "pres",
  "year", "month", "day", "hour", "minute", "moving_avg_3",
];

const inputClass =
  "w-full bg-white border rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition [color-scheme:light]";

export default function Model() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    temp: "", dwpt: "", rhum: "", wdir: "", wspd: "", pres: "",
    year: "", month: "", day: "", hour: "", minute: "", moving_avg_3: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validate = () => {
    const errors = {};
    requiredFields.forEach((key) => {
      if (form[key] === "" || form[key] === null || form[key] === undefined) {
        errors[key] = true;
      }
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchWeather = async () => {
    setLoadingWeather(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const res = await fetch(
            `http://127.0.0.1:8000/api/weather?lat=${lat}&lon=${lon}`
          );
          const data = await res.json();
          if (data.error) {
            toast.error("Backend error fetching weather.");
            return;
          }
          setForm({
            temp: data.temp ?? "",
            dwpt: data.dwpt ?? "",
            rhum: data.rhum ?? "",
            wdir: data.wdir ?? "",
            wspd: data.wspd ?? "",
            pres: data.pres ?? "",
            year: data.year ?? "",
            month: data.month ?? "",
            day: data.day ?? "",
            hour: data.hour ?? "",
            minute: data.minute ?? "",
            moving_avg_3: data.moving_avg_3 ?? "",
          });
          setFieldErrors({});
          toast.success("Data auto-filled from your location");
        } catch {
          toast.error("Failed to fetch weather data.");
        } finally {
          setLoadingWeather(false);
        }
      },
      () => {
        toast.error("Location permission denied.");
        setLoadingWeather(false);
      }
    );
  };

  const saveToHistory = (data) => {
    try {
      const existing = JSON.parse(localStorage.getItem("predictionHistory") || "[]");
      const newEntry = {
        id: Date.now(),
        demand: data.predicted_power_demand,
        date: new Date().toLocaleString(),
      };
      localStorage.setItem(
        "predictionHistory",
        JSON.stringify([newEntry, ...existing])
      );
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ── VALIDATION: block submit if any field is empty ──
    if (!validate()) {
      const emptyCount = requiredFields.filter(
        (k) => form[k] === "" || form[k] === null || form[k] === undefined
      ).length;
      toast.error(`Please fill in all required fields (${emptyCount} missing).`);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temp: Number(form.temp),
          dwpt: Number(form.dwpt),
          rhum: Number(form.rhum),
          wdir: Number(form.wdir),
          wspd: Number(form.wspd),
          pres: Number(form.pres),
          year: Number(form.year),
          month: Number(form.month),
          day: Number(form.day),
          hour: Number(form.hour),
          minute: Number(form.minute),
          moving_avg_3: Number(form.moving_avg_3),
        }),
      });
      const data = await response.json();
      if (response.ok && data.predicted_power_demand !== undefined) {
        setResult(data);
        saveToHistory(data);
      } else {
        toast.error(data.error || "Prediction failed. Check your server.");
      }
    } catch {
      toast.error("Cannot connect to server. Make sure the backend is running.");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (result) {
      const isHigh = result.demand_level?.toLowerCase() === "high";
      const isPeak = result.peak_alert === true;
      if (isHigh && isPeak) toast.error("Peak Load + High Demand!");
      else if (isHigh) toast.warning("High Electricity Demand!");
      else if (isPeak) toast.error("Peak Load Alert!");
      if (isHigh || isPeak) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        alarmSound.play().catch(() => {});
        setTimeout(() => {
          alarmSound.pause();
          alarmSound.currentTime = 0;
        }, 4000);
      }
    }
  }, [result]);

  const sectionClass =
    "bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm";
  const sectionLabel =
    "text-xs font-bold tracking-widest uppercase mb-5";

  const getInputBorderClass = (name) =>
    fieldErrors[name]
      ? "border-red-400 focus:ring-red-300 focus:border-red-400"
      : "border-slate-200";

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{
        backgroundColor: "#f0f6ff",
        backgroundImage:
          "radial-gradient(circle, #bfdbfe 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* WEATHER LOADING OVERLAY */}
      {loadingWeather && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl text-center w-full max-w-xs">
            <div className="flex justify-center gap-2 mb-5">
              <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" />
              <span
                className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.15s" }}
              />
              <span
                className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              Fetching Weather Data
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Please wait while we auto-fill inputs...
            </p>
          </div>
        </div>
      )}

      {/* TOP ACCENT BAR */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* HEADER */}
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-2">
            AI Prediction Engine
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
            Electricity Demand Forecast
          </h1>
          <p className="text-slate-500 text-sm">
            Enter environmental and time parameters to forecast electricity
            load using LSTM + XGBoost.
          </p>
        </div>

        {/* AUTO FETCH BUTTON */}
        <div className="flex justify-end mb-5">
          <button
            onClick={fetchWeather}
            disabled={loadingWeather}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 shadow-sm transition-all disabled:opacity-60"
          >
            {loadingWeather ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Fetching…
              </>
            ) : (
              <>
                <MapPin size={14} className="text-blue-500" /> Auto-Fill Weather
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">

          {/* ATMOSPHERIC CONDITIONS */}
          <div className={sectionClass}>
            <p className={`${sectionLabel} text-blue-600`}>
              Atmospheric Conditions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {inputFields.map(({ name, label, unit }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    {label}
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name={name}
                      type="number"
                      value={form[name]}
                      onChange={handleChange}
                      className={`${inputClass} pr-12 ${getInputBorderClass(name)}`}
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-medium pointer-events-none">
                      {unit}
                    </span>
                  </div>
                  {fieldErrors[name] && (
                    <p className="text-xs text-red-500 mt-1">Required</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* TIMESTAMP */}
          <div className={sectionClass}>
            <p className={`${sectionLabel} text-slate-600`}>Timestamp</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {timeFields.map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    {label}
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    name={name}
                    type="number"
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={handleChange}
                    className={`${inputClass} ${getInputBorderClass(name)}`}
                  />
                  {fieldErrors[name] && (
                    <p className="text-xs text-red-500 mt-1">Required</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* HISTORICAL SIGNAL */}
          <div className={sectionClass}>
            <p className={`${sectionLabel} text-amber-600`}>Historical Signal</p>
            <div className="w-full max-w-xs">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Moving Average (last 3 values)
                <span className="text-red-400 ml-0.5">*</span>
              </label>
              <input
                name="moving_avg_3"
                type="number"
                placeholder="e.g. 320.5"
                value={form.moving_avg_3}
                onChange={handleChange}
                className={`${inputClass} ${getInputBorderClass("moving_avg_3")}`}
              />
              {fieldErrors["moving_avg_3"] && (
                <p className="text-xs text-red-500 mt-1">Required</p>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-semibold text-sm shadow-md shadow-blue-200 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Running
                Prediction…
              </>
            ) : (
              <>
                <Zap size={16} className="text-amber-300" /> Run Prediction
              </>
            )}
          </button>
        </form>

        {/* RESULT CARD */}
        {result && (
          <div className="mt-6 sm:mt-8 bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-md">
            <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4">
              Prediction Result
            </p>

            <div className="flex items-end gap-2 mb-6">
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-900">
                {result.predicted_power_demand}
              </span>
              <span className="text-lg sm:text-xl text-slate-400 font-semibold mb-1">
                {result.unit}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-semibold mb-1">
                  Demand Level
                </p>
                <p
                  className={`text-sm font-bold ${
                    result.demand_level?.toLowerCase() === "high"
                      ? "text-red-500"
                      : result.demand_level?.toLowerCase() === "medium"
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }`}
                >
                  {result.demand_level}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-semibold mb-1">
                  Peak Alert
                </p>
                <p
                  className={`text-sm font-bold flex items-center gap-1.5 ${
                    result.peak_alert ? "text-red-500" : "text-emerald-500"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      result.peak_alert ? "bg-red-500" : "bg-emerald-500"
                    }`}
                  />
                  {result.peak_alert
                    ? "Peak Load Detected"
                    : "Normal Operation"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}