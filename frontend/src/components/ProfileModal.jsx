import React, { useState, useEffect, useRef } from "react";
import { User, Lock, X, Eye, EyeOff, CheckCircle, Zap } from "lucide-react";
import { API } from "../api";
import { toast } from "react-toastify";

const ProfileModal = ({ user, setUser, close }) => {
  const [name, setName] = useState(user?.name || "");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const panelRef = useRef();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

const updateName = async () => {
  if (!name) return toast.error("Name cannot be empty");

  console.log("TOKEN:", token); // 👈 ADD THIS

  try {
    await toast.promise(
      API.put("/api/auth/update-name", { name, token }),
      {
        pending: "Updating name...",
        success: "Name updated",
        error: "Failed to update",
      }
    );

    const updated = { ...user, name };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  } catch (err) {
    console.log(err.response?.data); // 👈 ADD THIS
  }
};
const changePassword = async () => {
  if (!oldPass || !newPass) return toast.error("Fill all fields");

  console.log("TOKEN:", token); // 👈 ADD THIS

  try {
    await toast.promise(
      API.put("/api/auth/change-password", {
        old_password: oldPass,
        new_password: newPass,
        token,
      }),
      {
        pending: "Changing password...",
        success: "Password updated",
        error: "Failed to change",
      }
    );

    setOldPass("");
    setNewPass("");
  } catch (err) {
    console.log(err.response?.data); // 👈 ADD THIS
  }
};
  const letter = user?.name ? user.name[0].toUpperCase() : "U";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm">

      {/* PANEL — fixed to top-right */}
      <div
        ref={panelRef}
        className="absolute top-16 right-4 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
        style={{ animation: "slideDown 0.2s ease-out" }}
      >
        {/* Top accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <User size={13} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 leading-none">Profile Settings</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Manage your account</p>
            </div>
          </div>
          <button
            onClick={close}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
          >
            <X size={13} />
          </button>
        </div>

        <div className="px-4 py-3 space-y-3">

          {/* USER CARD */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-200">
              {letter}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate leading-none">{user?.name}</p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse block" />
              <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
            </div>
          </div>

          {/* UPDATE NAME */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Update Name
            </p>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 mb-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <User size={12} className="text-slate-400 flex-shrink-0" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400"
                placeholder="Enter your name"
              />
            </div>
            <button
              onClick={updateName}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-sm shadow-blue-200 flex items-center justify-center gap-1.5"
            >
              <CheckCircle size={13} />
              Update Name
            </button>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-slate-100" />

          {/* CHANGE PASSWORD */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Change Password
            </p>
            <div className="space-y-1.5 mb-2">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Lock size={12} className="text-slate-400 flex-shrink-0" />
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400"
                  placeholder="Current password"
                />
                <button
                  onClick={() => setShowOld(!showOld)}
                  className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                >
                  {showOld ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Lock size={12} className="text-slate-400 flex-shrink-0" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400"
                  placeholder="New password"
                />
                <button
                  onClick={() => setShowNew(!showNew)}
                  className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                >
                  {showNew ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
            </div>

            <button
              onClick={changePassword}
              className="w-full py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-semibold text-sm transition-all"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-center gap-1.5 py-2 border-t border-slate-100 bg-slate-50">
          <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center">
            <Zap size={9} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">
            ElectraForecast
          </span>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProfileModal;