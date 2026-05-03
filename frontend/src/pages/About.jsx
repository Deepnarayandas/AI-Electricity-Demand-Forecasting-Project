import { Zap, Database, Brain, BarChart3, CheckCircle, Target, Code2, Layers } from "lucide-react";

export default function About() {

  const techStack = [
    { label: "React.js", sub: "Frontend UI", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { label: "Tailwind CSS", sub: "Styling", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
    { label: "FastAPI", sub: "Backend API", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { label: "LSTM & XGBoost", sub: "ML Models", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { label: "Pandas & NumPy", sub: "Data Processing", color: "bg-violet-50 text-violet-700 border-violet-200" },
    { label: "Scikit-learn", sub: "Model Training", color: "bg-orange-50 text-orange-700 border-orange-200" },
    { label: "Matplotlib", sub: "Visualization", color: "bg-rose-50 text-rose-700 border-rose-200" },
    { label: "Time-series Data", sub: "Datasets", color: "bg-slate-50 text-slate-700 border-slate-200" },
  ];

  const steps = [
    {
      icon: Database,
      num: "01",
      title: "Data Collection",
      desc: "Historical electricity demand with environmental parameters is collected and preprocessed.",
      accent: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Brain,
      num: "02",
      title: "Model Training",
      desc: "LSTM & XGBoost learn complex patterns in electricity usage behavior over time.",
      accent: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: BarChart3,
      num: "03",
      title: "Prediction",
      desc: "The system predicts future electricity demand in real time with high accuracy.",
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const benefits = [
    "Efficient power generation planning",
    "Prevents overload & shortages",
    "Improves grid reliability",
    "Optimizes energy distribution",
    "Supports smart grid systems",
  ];

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{
        backgroundColor: "#f0f6ff",
        backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* TOP ACCENT */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12 sm:pb-16 space-y-8 sm:space-y-10">

        {/* ── HERO ── */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-4">
            <Zap size={11} className="text-amber-500" />
            About the Project
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
            AI Electricity Demand<br />
            <span className="text-blue-600">Forecasting System</span>
          </h1>

          <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            An AI-powered smart grid system using LSTM & XGBoost to predict electricity demand,
            detect peak loads, and optimize energy distribution.
          </p>
        </div>

        {/* ── OVERVIEW ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Layers size={18} className="text-blue-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Project Overview</h2>
          </div>

          <p className="text-slate-500 mb-3 leading-relaxed text-sm sm:text-base">
            This system predicts electricity demand using AI models trained on historical
            consumption and environmental data.
          </p>
          <p className="text-slate-500 leading-relaxed text-sm sm:text-base">
            It enables power grid operators to make better decisions in energy distribution
            and demand management, reducing waste and preventing outages.
          </p>
        </div>

        {/* ── HOW IT WORKS ── */}
        <div>
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Zap size={18} className="text-amber-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {steps.map(({ icon: Icon, num, title, desc, accent, bg }) => (
              <div
                key={num}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4 sm:mb-5">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={accent} />
                  </div>
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-100 select-none">
                    {num}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BENEFITS ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={18} className="text-emerald-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Why It Matters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {benefits.map((b) => (
              <div
                key={b}
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-emerald-800 text-sm font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── GOAL ── */}
        <div className="relative bg-blue-600 rounded-2xl p-6 sm:p-8 overflow-hidden text-white shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -translate-y-32 translate-x-24 opacity-40" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Target size={18} className="text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Project Goal</h2>
            </div>
            <p className="text-blue-100 leading-relaxed text-sm sm:text-base max-w-2xl">
              Build an intelligent AI system that accurately forecasts electricity demand,
              helping energy providers optimize operations and ensure grid stability across smart infrastructure.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}