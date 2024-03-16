import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";

const NavigationBar = () => {
  const [page, setPage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const pageUrl = location.pathname;

  return (
    <div className="flex justify-between px-10 py-2 bg-cyan-950 text-white fixed w-full top-0 left-0 h-fit">
      <div className="logo">
        {/* <img src="./bus.svg" alt="Logo" /> */}
        <p className="text-2xl">TicketKatum</p>
      </div>
      {page === "admin" && <Navigate to={"/admin/login"} />}
      {page === "homepage" && <Navigate to={"/"} />}
      <div className="nav-buttons">
        {!pageUrl.includes("admin/panel") && (
          <button
            onClick={() => {
              setPage("admin");
            }}
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
          >
            Admin Logout
          </button>
        )}
        <button
          onClick={() => {
            setPage("homepage");
          }}
        >
          HomePage
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
