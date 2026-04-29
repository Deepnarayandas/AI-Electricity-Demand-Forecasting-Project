import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Zap, Activity, Shield, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const nameRegex = /^[A-Za-z]{3,}$/; // only letters, min 3 chars

    if (!form.name || !form.email || !form.password)
      return toast.error("All fields are required");

    if (!nameRegex.test(form.name))
      return toast.error("Name must be at least 3 letters and contain only alphabets");

    try {
      setLoading(true);
      await toast.promise(API.post("/api/auth/signup", form), {
        pending: "Creating your account...",
        success: "Account created successfully",
        error: {
          render({ data }) {
            return data?.response?.data?.detail || "Signup failed";
          },
        },
      });
      setTimeout(() => navigate("/login"), 1200);
    } finally {
      setLoading(false);
    }
  };

  const highlights = [
    { icon: Activity, label: "Real-time Prediction", desc: "Live demand forecasting" },
    { icon: Shield, label: "Peak Load Detection", desc: "Early overload warnings" },
    { icon: TrendingUp, label: "Appliance Prediction", desc: "Estimate energy usage per appliance & quantity" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">

      {/* Top accent bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600 z-10" />

      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 flex-col justify-center px-14 bg-white border-r border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
            <Zap size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-widest uppercase text-slate-800">
              ElectraForecast
            </h1>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase">Demand Forecasting System</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold tracking-wider uppercase mb-5 w-fit">
          <Zap size={10} className="text-amber-500" />
          Powered by XGBoost + LSTM
        </div>

        <h2 className="text-3xl font-bold text-slate-900 leading-snug mb-4">
          Predict Energy Demand<br />with Intelligence
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm">
          Advanced AI models help you forecast electricity demand accurately across your entire grid infrastructure.
        </p>

        <div className="space-y-3">
          {highlights.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{label}</p>
                <p className="text-slate-400 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-widest uppercase text-slate-800">ElectraForecast</div>
              <div className="text-[10px] tracking-widest uppercase text-slate-400">Demand Forecasting System</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">Create account</h2>
          <p className="text-sm text-slate-500 mb-7">Start forecasting electricity demand</p>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

            {/* Name */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Jane Smith"
                  value={form.name}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[A-Za-z]*$/.test(value)) {
                      setForm({ ...form, name: value });
                    }
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@organisation.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-7">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-blue-200 transition-all"
            >
              <Zap size={14} className="text-amber-300" />
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <p className="text-sm text-center mt-5 text-slate-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;