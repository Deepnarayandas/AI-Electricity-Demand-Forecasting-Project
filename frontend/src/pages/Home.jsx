// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import {
//   Zap,
//   TrendingUp,
//   Shield,
//   Activity,
//   Clock,
//   PlugZap,
//   ArrowRight,
//   CheckCircle,
//   BarChart2,
//   BrainCircuit,
//   Cpu,
// } from "lucide-react";

// const WORDS = ["Forecasting", "Intelligence", "Optimization", "Analytics"];

// export default function Home() {
//   const [wordIdx, setWordIdx] = useState(0);
//   const [displayed, setDisplayed] = useState("");
//   const [deleting, setDeleting] = useState(false);

//   useEffect(() => {
//     const target = WORDS[wordIdx];
//     let timeout;

//     if (!deleting && displayed.length < target.length) {
//       timeout = setTimeout(
//         () => setDisplayed(target.slice(0, displayed.length + 1)),
//         80
//       );
//     } else if (!deleting && displayed.length === target.length) {
//       timeout = setTimeout(() => setDeleting(true), 1500);
//     } else if (deleting && displayed.length > 0) {
//       timeout = setTimeout(
//         () => setDisplayed(displayed.slice(0, -1)),
//         45
//       );
//     } else {
//       setDeleting(false);
//       setWordIdx((i) => (i + 1) % WORDS.length);
//     }

//     return () => clearTimeout(timeout);
//   }, [displayed, deleting, wordIdx]);

//   const features = [
//     {
//       icon: Activity,
//       label: "Static-time forecast with weather input",
//       desc: "Live demand forecasting with real-time weather for current and custom inputs",
//     },
//     {
//       icon: Shield,
//       label: "Peak Load Detection",
//       desc: "Early warning alerts for overload scenarios",
//     },
//     {
//       icon: PlugZap,
//       label: "Appliance Energy Prediction",
//       desc: "Estimate energy usage per appliance & quantity",
//     },
//   ];

//   const predictionModes = [
//     {
//       icon: Activity,
//       title: "Real-time weather data input",
//       tag: "Live",
//       tagColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
//       iconBg: "bg-emerald-50",
//       iconColor: "text-emerald-600",
//       border: "border-emerald-200",
//       desc: "Auto-fetches live weather from your GPS location and instantly predicts current electricity demand. Triggers alerts if peak load or high demand is detected.",
//       points: [
//         "GPS-based weather auto-fill",
//         "Real-time peak load alerts",
//         "Sound notification on high demand",
//       ],
//       link: "/model",
//     },
//     {
//       icon: Clock,
//       title: "Static-time Prediction",
//       tag: "Custom",
//       tagColor: "bg-blue-100 text-blue-700 border-blue-200",
//       iconBg: "bg-blue-50",
//       iconColor: "text-blue-600",
//       border: "border-blue-200",
//       desc: "Manually enter any date, time, and atmospheric conditions to forecast demand for a specific future or past scenario — useful for planning and analysis.",
//       points: [
//         "Custom date & time input",
//         "Manual weather parameter entry",
//         "Historical scenario analysis",
//       ],
//       link: "/model",
//     },
//     {
//       icon: PlugZap,
//       title: "Appliance Prediction",
//       tag: "Usage",
//       tagColor: "bg-amber-100 text-amber-700 border-amber-200",
//       iconBg: "bg-amber-50",
//       iconColor: "text-amber-600",
//       border: "border-amber-200",
//       desc: "Enter quantity and daily usage hours for household appliances like AC, fans, heaters, and lights to calculate total estimated energy consumption.",
//       points: [
//         "Per-appliance kWh breakdown",
//         "Load level classification",
//         "Supports 6 appliance types",
//       ],
//       link: "/appliance",
//     },
//   ];

//   const stats = [
//     { value: "XGBoost", label: "Primary Model", sub: "Gradient Boosted Trees" },
//     { value: "LSTM", label: "Deep Learning", sub: "Long Short-Term Memory" },
//     { value: "6+", label: "Input Features", sub: "Weather + Time signals" },
//     { value: "3", label: "Prediction Modes", sub: "Real-time · Static · Appliance" },
//   ];

//   const howSteps = [
//     {
//       num: "01",
//       icon: BrainCircuit,
//       title: "Input Parameters",
//       desc: "Provide weather data (temperature, humidity, pressure, wind) and timestamp — manually or via GPS auto-fill.",
//       color: "text-blue-600",
//       bg: "bg-blue-50",
//     },
//     {
//       num: "02",
//       icon: Cpu,
//       title: "AI Processing",
//       desc: "LSTM and XGBoost models analyse inputs alongside moving averages to compute a precise demand estimate.",
//       color: "text-amber-600",
//       bg: "bg-amber-50",
//     },
//     {
//       num: "03",
//       icon: BarChart2,
//       title: "Result & Alert",
//       desc: "Predicted demand (kWh), demand level, and peak alert status are returned instantly with sound warnings if needed.",
//       color: "text-emerald-600",
//       bg: "bg-emerald-50",
//     },
//   ];

//   return (
//     <div
//       className="min-h-screen text-slate-900 font-sans relative"
//       style={{
//         backgroundColor: "#f0f6ff",
//         backgroundImage:
//           "radial-gradient(circle, #bfdbfe 1px, transparent 1px)",
//         backgroundSize: "28px 28px",
//       }}
//     >
//       <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

//       {/* HERO */}
//       <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
//         <div className="flex justify-center mb-5">
//           <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-widest uppercase">
//             <Zap size={11} className="text-amber-500" />
//             Powered by XGBoost + LSTM
//           </span>
//         </div>

//         <div className="text-center mb-7">
//           <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-2 leading-tight">
//             AI Electricity Demand
//           </h1>

//           <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-blue-600 min-h-[1.2em] mb-4">
//             {displayed}
//             <span className="animate-pulse text-amber-400">|</span>
//           </h1>

//           <p className="max-w-xl mx-auto text-slate-500 text-lg leading-relaxed">
//             Smart grid system using AI to predict electricity demand,
//             detect peak loads, and visualize power trends in real time.
//           </p>
//         </div>

//         <div className="flex justify-center mb-10">
//           <Link
//             to="/model"
//             className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200 transition-all hover:scale-105"
//           >
//             <Zap size={16} className="text-amber-300" />
//             Start Prediction
//           </Link>
//         </div>

//         <div className="border-t border-slate-200 mb-10" />

//         {/* FEATURES */}
//         <div>
//           <div className="text-center mb-7">
//             <p className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-2">
//               Intelligent Energy Platform
//             </p>

//             <h2 className="text-3xl font-bold text-slate-900 mb-3 leading-snug">
//               Intelligent Energy Forecasting System
//             </h2>

//             <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
//               Our platform leverages advanced AI models — LSTM and XGBoost —
//               to analyze historical electricity consumption and predict future
//               demand with high precision.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {features.map(({ icon: Icon, label, desc }) => (
//               <div
//                 key={label}
//                 className="flex items-start gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
//               >
//                 <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
//                   <Icon size={18} className="text-blue-600" />
//                 </div>

//                 <div>
//                   <p className="font-bold text-slate-800 text-sm mb-0.5">
//                     {label}
//                   </p>
//                   <p className="text-slate-400 text-xs leading-relaxed">
//                     {desc}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* STATS */}
//       <div className="bg-white/80 backdrop-blur-sm border-y border-slate-200">
//         <div className="max-w-6xl mx-auto px-6 py-7 grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
//           {stats.map(({ value, label, sub }) => (
//             <div key={label} className="text-center px-6">
//               <p className="text-2xl font-extrabold text-blue-600 mb-0.5">
//                 {value}
//               </p>
//               <p className="text-sm font-semibold text-slate-800">{label}</p>
//               <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* MODES */}
//       <div className="max-w-6xl mx-auto px-6 py-14">
//         <div className="text-center mb-8">
//           <p className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-2">
//             What You Can Do
//           </p>

//           <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
//             Three Prediction Modes
//           </h2>

//           <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
//             Choose the mode that fits your use case — from live forecasting to
//             custom scenario analysis and per-appliance energy estimation.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-5">
//           {predictionModes.map(
//             ({
//               icon: Icon,
//               title,
//               tag,
//               tagColor,
//               iconBg,
//               iconColor,
//               border,
//               desc,
//               points,
//               link,
//             }) => (
//               <div
//                 key={title}
//                 className={`bg-white border ${border} rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow flex flex-col`}
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <div
//                     className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}
//                   >
//                     <Icon size={20} className={iconColor} />
//                   </div>

//                   <span
//                     className={`text-xs font-bold px-2.5 py-1 rounded-full border ${tagColor}`}
//                   >
//                     {tag}
//                   </span>
//                 </div>

//                 <h3 className="font-bold text-slate-900 text-base mb-2">
//                   {title}
//                 </h3>

//                 <p className="text-slate-500 text-sm leading-relaxed mb-4">
//                   {desc}
//                 </p>

//                 <ul className="space-y-2 mb-5 flex-1">
//                   {points.map((p) => (
//                     <li
//                       key={p}
//                       className="flex items-start gap-2 text-xs text-slate-600"
//                     >
//                       <CheckCircle
//                         size={13}
//                         className={`${iconColor} mt-0.5 flex-shrink-0`}
//                       />
//                       {p}
//                     </li>
//                   ))}
//                 </ul>

//                 <Link
//                   to={link}
//                   className={`inline-flex items-center gap-1.5 text-xs font-semibold ${iconColor} hover:underline mt-auto`}
//                 >
//                   Try it now <ArrowRight size={13} />
//                 </Link>
//               </div>
//             )
//           )}
//         </div>
//       </div>

//       {/* HOW IT WORKS */}
//       <div className="min-h-screen text-slate-900" style={{ backgroundColor: "#f0f6ff", backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)", backgroundSize: "28px 28px" }}>
//         <div className="max-w-6xl mx-auto px-6 py-14">
//           <div className="text-center mb-8">
//             <p className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-2">
//               Under the Hood
//             </p>

//             <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
//               How It Works
//             </h2>

//             <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
//               From raw input to prediction result in three clean steps.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-5 relative">
//             <div className="hidden md:block absolute top-[2.2rem] left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-slate-200 z-0" />

//             {howSteps.map(({ num, icon: Icon, title, desc, color, bg }) => (
//               <div
//                 key={num}
//                 className="relative z-10 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center"
//               >
//                 <div
//                   className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center mx-auto mb-3 border-2 border-white shadow`}
//                 >
//                   <Icon size={20} className={color} />
//                 </div>

//                 <span className="text-xs font-bold text-slate-300 tracking-widest">
//                   {num}
//                 </span>

//                 <h3 className="font-bold text-slate-900 mt-1 mb-2">
//                   {title}
//                 </h3>

//                 <p className="text-slate-500 text-sm leading-relaxed">
//                   {desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Zap,
  TrendingUp,
  Shield,
  Activity,
  Clock,
  PlugZap,
  ArrowRight,
  CheckCircle,
  BarChart2,
  BrainCircuit,
  Cpu,
} from "lucide-react";

const WORDS = ["Forecasting", "Intelligence", "Optimization", "Analytics"];

export default function Home() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = WORDS[wordIdx];
    let timeout;

    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(
        () => setDisplayed(target.slice(0, displayed.length + 1)),
        80
      );
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 1500);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % WORDS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx]);

  const features = [
    {
      icon: Activity,
      label: "Static-time forecast with weather input",
      desc: "Live demand forecasting with real-time weather for current and custom inputs",
    },
    {
      icon: Shield,
      label: "Peak Load Detection",
      desc: "Early warning alerts for overload scenarios",
    },
    {
      icon: PlugZap,
      label: "Appliance Energy Prediction",
      desc: "Estimate energy usage per appliance & quantity",
    },
  ];

  const predictionModes = [
    {
      icon: Activity,
      title: "Real-time weather data input",
      tag: "Live",
      tagColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      border: "border-emerald-200",
      desc: "Auto-fetches live weather from your GPS location and instantly predicts current electricity demand. Triggers alerts if peak load or high demand is detected.",
      points: [
        "GPS-based weather auto-fill",
        "Real-time peak load alerts",
        "Sound notification on high demand",
      ],
      link: "/model",
    },
    {
      icon: Clock,
      title: "Static-time Prediction",
      tag: "Custom",
      tagColor: "bg-blue-100 text-blue-700 border-blue-200",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      border: "border-blue-200",
      desc: "Manually enter any date, time, and atmospheric conditions to forecast demand for a specific future or past scenario — useful for planning and analysis.",
      points: [
        "Custom date & time input",
        "Manual weather parameter entry",
        "Historical scenario analysis",
      ],
      link: "/model",
    },
    {
      icon: PlugZap,
      title: "Appliance Prediction",
      tag: "Usage",
      tagColor: "bg-amber-100 text-amber-700 border-amber-200",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      border: "border-amber-200",
      desc: "Enter quantity and daily usage hours for household appliances like AC, fans, heaters, and lights to calculate total estimated energy consumption.",
      points: [
        "Per-appliance kWh breakdown",
        "Load level classification",
        "Supports 6 appliance types",
      ],
      link: "/appliance",
    },
  ];

  const stats = [
    { value: "XGBoost", label: "Primary Model", sub: "Gradient Boosted Trees" },
    { value: "LSTM", label: "Deep Learning", sub: "Long Short-Term Memory" },
    { value: "6+", label: "Input Features", sub: "Weather + Time signals" },
    { value: "3", label: "Prediction Modes", sub: "Real-time · Static · Appliance" },
  ];

  const howSteps = [
    {
      num: "01",
      icon: BrainCircuit,
      title: "Input Parameters",
      desc: "Provide weather data (temperature, humidity, pressure, wind) and timestamp — manually or via GPS auto-fill.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      num: "02",
      icon: Cpu,
      title: "AI Processing",
      desc: "LSTM and XGBoost models analyse inputs alongside moving averages to compute a precise demand estimate.",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      num: "03",
      icon: BarChart2,
      title: "Result & Alert",
      desc: "Predicted demand (kWh), demand level, and peak alert status are returned instantly with sound warnings if needed.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const bgStyle = {
    backgroundColor: "#f0f6ff",
    backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)",
    backgroundSize: "28px 28px",
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans" style={bgStyle}>
      {/* TOP ACCENT */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

      {/* ── HERO ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-10">
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-widest uppercase">
            <Zap size={11} className="text-amber-500" />
            Powered by XGBoost + LSTM
          </span>
        </div>

        <div className="text-center mb-7">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-2 leading-tight">
            AI Electricity Demand
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-blue-600 min-h-[1.2em] mb-4">
            {displayed}
            <span className="animate-pulse text-amber-400">|</span>
          </h1>
          <p className="max-w-xl mx-auto text-slate-500 text-base sm:text-lg leading-relaxed">
            Smart grid system using AI to predict electricity demand, detect
            peak loads, and visualize power trends in real time.
          </p>
        </div>

        <div className="flex justify-center mb-8 sm:mb-10">
          <Link
            to="/model"
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200 transition-all hover:scale-105 text-sm sm:text-base"
          >
            <Zap size={16} className="text-amber-300" />
            Start Prediction
          </Link>
        </div>

        <div className="border-t border-slate-200 mb-8 sm:mb-10" />

        {/* ── FEATURES ── */}
        <div>
          <div className="text-center mb-6 sm:mb-7">
            <p className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-2">
              Intelligent Energy Platform
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 leading-snug">
              Intelligent Energy Forecasting System
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
              Our platform leverages advanced AI models — LSTM and XGBoost —
              to analyze historical electricity consumption and predict future
              demand with high precision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex items-start gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm mb-0.5">
                    {label}
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="bg-white/80 backdrop-blur-sm border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-7 grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
          {stats.map(({ value, label, sub }) => (
            <div key={label} className="text-center px-3 sm:px-6">
              <p className="text-xl sm:text-2xl font-extrabold text-blue-600 mb-0.5">
                {value}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {label}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                {sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PREDICTION MODES ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center mb-7 sm:mb-8">
          <p className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-2">
            What You Can Do
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Three Prediction Modes
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
            Choose the mode that fits your use case — from live forecasting to
            custom scenario analysis and per-appliance energy estimation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {predictionModes.map(
            ({
              icon: Icon,
              title,
              tag,
              tagColor,
              iconBg,
              iconColor,
              border,
              desc,
              points,
              link,
            }) => (
              <div
                key={title}
                className={`bg-white border ${border} rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow flex flex-col`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}
                  >
                    <Icon size={20} className={iconColor} />
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${tagColor}`}
                  >
                    {tag}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-2">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {desc}
                </p>

                <ul className="space-y-2 mb-5 flex-1">
                  {points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2 text-xs text-slate-600"
                    >
                      <CheckCircle
                        size={13}
                        className={`${iconColor} mt-0.5 flex-shrink-0`}
                      />
                      {p}
                    </li>
                  ))}
                </ul>

                <Link
                  to={link}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${iconColor} hover:underline mt-auto`}
                >
                  Try it now <ArrowRight size={13} />
                </Link>
              </div>
            )
          )}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-16">
        <div className="text-center mb-7 sm:mb-8">
          <p className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-2">
            Under the Hood
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            How It Works
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
            From raw input to prediction result in three clean steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 relative">
          {/* connector line — desktop only */}
          <div className="hidden md:block absolute top-[2.2rem] left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-slate-200 z-0" />

          {howSteps.map(({ num, icon: Icon, title, desc, color, bg }) => (
            <div
              key={num}
              className="relative z-10 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center"
            >
              <div
                className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center mx-auto mb-3 border-2 border-white shadow`}
              >
                <Icon size={20} className={color} />
              </div>
              <span className="text-xs font-bold text-slate-300 tracking-widest">
                {num}
              </span>
              <h3 className="font-bold text-slate-900 mt-1 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}