import React, { useEffect, useRef } from "react";
import { User, LogOut, LogIn, HelpCircle, Mail, Zap, ChevronRight } from "lucide-react";

const ProfileDropdown = ({
  user,
  setUser,
  setPage,
  openProfile,
  openSupport,
  close,
}) => {
  const dropdownRef = useRef();

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setPage("auth");
    close();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        close();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  const letter = user?.name ? user.name[0].toUpperCase() : "G";

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 w-64 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden"
      style={{ animation: "slideDown 0.2s ease-out" }}
    >
      {/* Top gradient accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

      {/* User info card */}
      <div className="px-4 pt-3 pb-3 border-b border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Account
        </p>
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-200">
            {letter}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate leading-none">
              {user ? user.name : "Guest"}
            </p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {user ? user.email : "Not logged in"}
            </p>
          </div>
          {user && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse block" />
            </div>
          )}
        </div>
      </div>

      {/* Menu items */}
      <div className="px-3 py-2 space-y-0.5">
        {user ? (
          <>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 pt-1 pb-1.5">
              Menu
            </p>

            <button
              onClick={() => { openProfile(); close(); }}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors duration-150 group"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <User size={12} className="text-blue-600" />
              </div>
              <span className="text-sm text-slate-700 font-medium flex-1 text-left">Profile</span>
              <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
            </button>

            <button
              onClick={() => { openSupport(); close(); }}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors duration-150 group"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <HelpCircle size={12} className="text-amber-500" />
              </div>
              <span className="text-sm text-slate-700 font-medium flex-1 text-left">Support</span>
              <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
            </button>

            <button
              onClick={() => { setPage("contact"); close(); }}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors duration-150 group"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Mail size={12} className="text-slate-500" />
              </div>
              <span className="text-sm text-slate-700 font-medium flex-1 text-left">Contact</span>
              <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
            </button>

            <div className="border-t border-slate-100 my-1.5" />

            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-red-50 active:scale-[0.98] transition-all duration-150 group"
            >
              <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <LogOut size={12} className="text-red-400" />
              </div>
              <span className="text-sm text-red-500 font-semibold flex-1 text-left">Logout</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => { setPage("login"); close(); }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors duration-150 group"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <LogIn size={12} className="text-blue-600" />
            </div>
            <span className="text-sm text-slate-700 font-medium flex-1 text-left">Sign in</span>
            <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
          </button>
        )}
      </div>

      {/* Footer branding */}
      <div className="flex items-center justify-center gap-1.5 py-2 border-t border-slate-100 bg-slate-50">
        <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center">
          <Zap size={9} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">
          ElectraForecast
        </span>
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

export default ProfileDropdown;
