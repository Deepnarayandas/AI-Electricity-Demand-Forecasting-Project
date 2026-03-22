// import { NavLink } from "react-router-dom";
// import { Home, Cpu, Info, Zap } from "lucide-react";

// export default function Navbar() {

//   const linkStyle = ({ isActive }) =>
//     `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//       isActive
//         ? "bg-white text-cyan-600 shadow-md"
//         : "text-white hover:bg-cyan-400/40"
//     }`;

//   return (

//     <nav className="bg-gradient-to-r from-sky-500 to-cyan-500 shadow-md">

//       <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

//         {/* Logo */}

//         <div className="flex items-center gap-2 text-white font-bold text-xl">

//           <Zap size={24} />
//           AI Power Forecast

//         </div>

//         {/* Navigation */}

//         <div className="flex items-center gap-4">

//           <NavLink to="/" className={linkStyle}>
//             <Home size={18} />
//             Home
//           </NavLink>

//           <NavLink to="/model" className={linkStyle}>
//             <Cpu size={18} />
//             Model
//           </NavLink>

//           <NavLink to="/about" className={linkStyle}>
//             <Info size={18} />
//             About
//           </NavLink>

//         </div>

//       </div>

//     </nav>

//   );
// }

import { Link } from "react-router-dom";

export default function Navbar() {

  return (
    <div className="bg-gray-800 flex justify-between px-6 py-4 shadow">

      <h1 className="font-bold text-lg">⚡ AI Power Forecast</h1>

      <div className="flex gap-6">
        <Link to="/">Home</Link>
        <Link to="/model">Model</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/about">About</Link>
      </div>

    </div>
  );
}