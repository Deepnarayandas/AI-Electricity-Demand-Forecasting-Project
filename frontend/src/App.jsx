import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import ProfileModal from "./components/ProfileModal";
import SupportModal from "./components/SupportModal";


import Home from "./pages/Home";
import Model from "./pages/Model";
import About from "./pages/About";
import NotFound from "./pages/Notfound";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/Forgotpassword";

import History from "./pages/History";
import Appliance from "./pages/Appliance";
import Contact from "./pages/Contact";

import Footer from "./components/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
  const location = useLocation();

  // // ✅ Initialize translation (no UI change, just activates it)
  // const { i18n } = useTranslation();

  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  const [showProfile, setShowProfile] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  // ✅ AUTH SYNC (Improved)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    const validAuth =
      token &&
      token !== "undefined" &&
      token !== "null" &&
      token.trim() !== "";

    setIsAuth(validAuth);

    if (savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("User parse error:", err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  // ✅ Hide Navbar & Chatbot on auth pages
  const hideUI = ["/login", "/signup", "/forgot"].includes(location.pathname);

  // ✅ Protected Route Wrapper
  const PrivateRoute = ({ children }) => {
    return isAuth ? children : <Navigate to="/login" replace />;
  };

  return (
    <>
      {/* 🔔 Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        style={{ zIndex: 999999 }}
      />

      {/* 🧭 Navbar */}
      {!hideUI && (
        <Navbar
          user={user}
          setUser={setUser}
          openProfile={() => {
            setShowSupport(false);
            setShowProfile(true);
          }}
          openSupport={() => {
            setShowProfile(false);
            setShowSupport(true);
          }}
        />
      )}

      {/* 🚀 ROUTES */}
      <Routes>

        {/* ROOT REDIRECT */}
        <Route
          path="/"
          element={
            isAuth ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 🔐 AUTH ROUTES */}
        <Route
          path="/login"
          element={
            isAuth ? <Navigate to="/home" replace /> : <Login setUser={setUser} />
          }
        />

        <Route
          path="/signup"
          element={
            isAuth ? <Navigate to="/home" replace /> : <Signup />
          }
        />

        <Route path="/forgot" element={<ForgotPassword />} />

        {/* 🏠 MAIN APP */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/model"
          element={
            <PrivateRoute>
              <Model />
            </PrivateRoute>
          }
        />

        <Route
          path="/about"
          element={
            <PrivateRoute>
              <About />
            </PrivateRoute>
          }
        />

        {/* ⚡ Appliance Page */}
        <Route
          path="/appliance"
          element={
            <PrivateRoute>
              <Appliance />
            </PrivateRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <PrivateRoute>
              <Contact />
            </PrivateRoute>
          }
        />

        {/* 📊 History */}
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />

        {/* ❌ 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>

      {/* 👤 PROFILE MODAL */}
      {showProfile && (
        <ProfileModal
          user={user}
          setUser={setUser}
          close={() => setShowProfile(false)}
        />
      )}

      {/* 🎫 SUPPORT MODAL */}
      {showSupport && (
        <SupportModal close={() => setShowSupport(false)} />
      )}

      {/* ✅ FOOTER */}
      {!hideUI && <Footer />}

      {/* 🤖 CHATBOT */}
      {!hideUI && <Chatbot />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;