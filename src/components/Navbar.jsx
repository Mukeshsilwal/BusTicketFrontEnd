import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const NavigationBar = () => {
  const [page, setPage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const pageUrl = location.pathname;

  return (
    <div className="flex justify-between items-center px-10 py-4 bg-gradient-to-r from-cyan-800 to-cyan-950 text-white fixed w-full top-0 left-0 z-50 shadow-lg">
      <div className="logo flex items-center">
        {/* <img src="./bus.svg" alt="Logo" className="h-8 mr-2" /> */}
        <p className="text-2xl font-bold text-white">TicketKatum</p>
      </div>

      <div className="nav-buttons flex space-x-4">
        {!pageUrl.includes("admin/panel") && (
          <button
            onClick={() => setPage("admin")}
            className="px-4 py-2 bg-white text-cyan-800 rounded-lg hover:bg-cyan-100 transition-all duration-300 font-semibold shadow-md"
          >
            Admin Login
          </button>
        )}
        {pageUrl.includes("admin/panel") && (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold shadow-md"
          >
            Admin Logout
          </button>
        )}
        <button
          onClick={() => setPage("homepage")}
          className="px-4 py-2 bg-white text-cyan-800 rounded-lg hover:bg-cyan-100 transition-all duration-300 font-semibold shadow-md"
        >
          HomePage
        </button>
      </div>

      {/* Navigate based on page state */}
      {page === "admin" && <Navigate to="/admin/login" />}
      {page === "homepage" && <Navigate to="/" />}
    </div>
  );
};

export default NavigationBar;