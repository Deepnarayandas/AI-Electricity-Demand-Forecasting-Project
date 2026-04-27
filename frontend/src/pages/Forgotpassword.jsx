import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, Lock, ArrowRight, Zap, Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";
import { API } from "../api";
import { toast } from "react-toastify";

const ForgotPassword = ({ setPage }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleEmailCheck = async () => {
    if (!email) return toast.error("Enter email");
    try {
      setLoading(true);
      const id = toast.loading("Sending OTP...");
      await API.post("/api/auth/forgot-password", { email });
      toast.update(id, { render: "OTP sent to your email", type: "success", isLoading: false, autoClose: 2000 });
      setEmailVerified(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Email not found");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");
    try {
      setLoading(true);
      const id = toast.loading("Verifying OTP...");
      await API.post("/api/auth/verify-otp", { email, otp });
      toast.update(id, { render: "OTP verified", type: "success", isLoading: false, autoClose: 2000 });
      setOtpVerified(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirm) return toast.error("Enter password");
    if (password !== confirm) return toast.error("Passwords do not match");
    try {
      setLoading(true);
      const id = toast.loading("Updating password...");
      await API.post("/api/auth/reset-password", { email, new_password: password });
      toast.update(id, {
        render: "Password updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 1500,
        onClose: () => setPage("login"),
      });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  const step = !emailVerified ? 1 : !otpVerified ? 2 : 3;
  const stepLabels = ["Verify Email", "Enter OTP", "New Password"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

      {/* Top accent bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

      <div className="w-full max-w-[440px]">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
            <Zap size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm font-bold tracking-widest uppercase text-slate-800">ElectraForecast</div>
            <div className="text-[10px] tracking-widest uppercase text-slate-400">Demand Forecasting System</div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Card top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

          <div className="p-8">

            {/* Header */}
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold tracking-widest uppercase mb-4">
                <ShieldCheck size={11} className="text-blue-500" />
                Account Recovery
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Reset your password</h2>
              <p className="text-sm text-slate-500">Verify your identity to restore account access</p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-7">
              {stepLabels.map((label, i) => {
                const idx = i + 1;
                const isActive = step === idx;
                const isDone = step > idx;
                return (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300
                        ${isDone
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                          : isActive
                            ? "bg-blue-50 border-2 border-blue-600 text-blue-600"
                            : "bg-slate-100 border border-slate-200 text-slate-400"
                        }`}>
                        {isDone ? <CheckCircle2 size={14} /> : idx}
                      </div>
                      <span className={`text-[9px] font-semibold tracking-wide whitespace-nowrap
                        ${isDone ? "text-blue-600" : isActive ? "text-blue-600" : "text-slate-400"}`}>
                        {label}
                      </span>
                    </div>
                    {i < stepLabels.length - 1 && (
                      <div className={`flex-1 h-px mb-4 transition-all duration-500
                        ${step > idx ? "bg-blue-400" : "bg-slate-200"}`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* STEP 1: Email */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">
                Email Address
              </label>
              <div className={`flex items-center rounded-xl px-4 py-3 border transition-all duration-200
                ${emailVerified
                  ? "bg-slate-50 border-slate-200 opacity-60"
                  : "bg-slate-50 border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
                }`}>
                <Mail size={15} className="text-slate-400 flex-shrink-0 mr-3" />
                <input
                  type="email"
                  placeholder="you@powersystem.io"
                  className="w-full outline-none bg-transparent text-sm text-slate-800 placeholder-slate-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={emailVerified}
                />
                {emailVerified && <CheckCircle2 size={15} className="text-blue-600 flex-shrink-0" />}
              </div>
            </div>

            {!emailVerified && (
              <button
                onClick={handleEmailCheck}
                disabled={loading}
                className={`flex items-center justify-between w-full px-5 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-px active:scale-[0.98] mb-4 bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <span>{loading ? "Sending OTP..." : "Send OTP"}</span>
                <ArrowRight size={15} />
              </button>
            )}

            {/* STEP 2: OTP */}
            {emailVerified && (
              <>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">
                    One-Time Password
                  </label>
                  <div className={`flex items-center rounded-xl px-4 py-3 border transition-all duration-200
                    ${otpVerified
                      ? "bg-slate-50 border-slate-200 opacity-60"
                      : "bg-slate-50 border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
                    }`}>
                    <ShieldCheck size={15} className="text-slate-400 flex-shrink-0 mr-3" />
                    <input
                      type="text"
                      placeholder="Enter OTP sent to your email"
                      className="w-full outline-none bg-transparent text-sm tracking-widest text-slate-800 placeholder-slate-400 placeholder:tracking-normal"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={otpVerified}
                    />
                    {otpVerified && <CheckCircle2 size={15} className="text-blue-600 flex-shrink-0" />}
                  </div>
                </div>

                {!otpVerified && (
                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className={`flex items-center justify-between w-full px-5 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-px active:scale-[0.98] mb-4 bg-slate-700 hover:bg-slate-800 shadow-sm ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    <span>{loading ? "Verifying..." : "Verify OTP"}</span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </>
            )}

            {/* STEP 3: New Password */}
            {otpVerified && (
              <>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">
                    New Password
                  </label>
                  <div className="flex items-center rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <Lock size={15} className="text-slate-400 flex-shrink-0 mr-3" />
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Enter new password"
                      className="w-full outline-none bg-transparent text-sm text-slate-800 placeholder-slate-400"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="ml-2 flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="mb-7">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">
                    Confirm Password
                  </label>
                  <div className="flex items-center rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <KeyRound size={15} className="text-slate-400 flex-shrink-0 mr-3" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-full outline-none bg-transparent text-sm text-slate-800 placeholder-slate-400"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="ml-2 flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className={`flex items-center justify-between w-full px-5 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-px active:scale-[0.98] mb-4 bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  <span>{loading ? "Updating..." : "Reset password"}</span>
                  <ArrowRight size={15} />
                </button>
              </>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[11px] tracking-widest text-slate-400 uppercase">or</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Back to login */}
            <p className="text-center text-sm text-slate-500">
              Remember your password?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-semibold text-blue-600 cursor-pointer hover:underline"
              >
                Back to login
              </span>
            </p>
          </div>

          {/* Bottom status bar */}
          <div className="px-8 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 tracking-wide">System Online</span>
            </div>
            <span className="text-[10px] text-slate-400 tracking-wide">TLS 1.3 · AES-256</span>
          </div>
        </div>

        <p className="text-center text-[11px] mt-5 tracking-wide text-slate-400">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;