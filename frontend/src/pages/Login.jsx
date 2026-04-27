import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";
import { toast } from "react-toastify";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password)
      return toast.error("Please fill all fields");
    try {
      const res = await API.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      toast.success("Login successful");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

      {/* Top accent bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Zap size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 tracking-widest uppercase">
                ElectraForecast
              </div>
              <div className="text-[10px] tracking-widest uppercase text-slate-400">
                Demand Forecasting System
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">
              Email
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="you@organisation.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                Password
              </label>
              <span
                onClick={() => navigate("/forgot")}
                className="text-xs text-blue-600 cursor-pointer hover:underline font-medium"
              >
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-blue-200 transition-all"
          >
            <Zap size={14} className="text-amber-300" />
            Sign in
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-5">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Create Account
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;