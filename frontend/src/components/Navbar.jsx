import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Zap,
  Menu,
  X,
  ChevronDown,
  User,
  HeadphonesIcon,
  LogOut,
  LineChart,
  Mail,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

const Navbar = ({ user, setUser, openProfile, openSupport }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const links = [
    { to: "/home", label: "Home" },
    { to: "/model", label: "Model" },
    { to: "/appliance", label: "Appliance" },
    { to: "/history", label: "History" },
    { to: "/about", label: "About Us" },
  ];

  const letter = user?.name?.charAt(0)?.toUpperCase() || "D";

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/home" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <LineChart className="text-white" size={18} />
            </div>
            <div>
              <p className="text-slate-900 font-semibold tracking-wide text-sm leading-tight">
                ELECTRAFORECAST
              </p>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">
                Forecasting System
              </p>
            </div>
          </Link>

          {/* NAV LINKS */}
          <ul className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/home"}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* AUTH */}
            {token ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-blue-200">
                    {letter}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* DROPDOWN */}
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />

                    <div
                      className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 z-50 overflow-hidden"
                      style={{ animation: "slideDown 0.2s ease-out" }}
                    >
                      {/* Top gradient accent */}
                      <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

                      {/* USER INFO CARD */}
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
                              {user?.name || "User"}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {user?.email || ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse block" />
                          </div>
                        </div>
                      </div>

                      {/* MENU ITEMS */}
                      <div className="px-3 py-2 space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 pt-1 pb-1.5">
                          Menu
                        </p>

                        <button
                          onClick={() => { openProfile(); setDropdownOpen(false); }}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors duration-150 group"
                        >
                          <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <User size={12} className="text-blue-600" />
                          </div>
                          <span className="text-sm text-slate-700 font-medium flex-1 text-left">Profile</span>
                          <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                        </button>

                        <button
                          onClick={() => { openSupport(); setDropdownOpen(false); }}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors duration-150 group"
                        >
                          <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                            <HelpCircle size={12} className="text-amber-500" />
                          </div>
                          <span className="text-sm text-slate-700 font-medium flex-1 text-left">Support</span>
                          <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                        </button>

                        <button
                          onClick={() => { navigate("/contact"); setDropdownOpen(false); }}
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
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-red-50 active:scale-[0.98] transition-all duration-150 group"
                        >
                          <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                            <LogOut size={12} className="text-red-400" />
                          </div>
                          <span className="text-sm text-red-500 font-semibold flex-1 text-left">Logout</span>
                        </button>
                      </div>

                      {/* FOOTER BRANDING */}
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
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="h-16" />
    </>
  );
};

export default Navbar;