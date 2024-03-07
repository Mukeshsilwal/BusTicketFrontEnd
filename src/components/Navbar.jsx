import { Navigate } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";

const NavigationBar = () => {
  const [page, setPage] = useState("");

  return (
    <div className="flex justify-between px-10 py-2 bg-cyan-950 text-white fixed w-full top-0 left-0 h-fit">
      <div className="logo">
        {/* Replace 'YourLogo' with your actual logo */}
        <img src="./bus.svg" alt="Logo" />
      </div>
      {page === "admin" && <Navigate to={"/admin/login"} />}
      <div className="nav-buttons">
        <button
          onClick={() => {
            setPage("admin");
          }}
        >
          Admin Login
        </button>
        <button>Button 2</button>
        <button>Button 3</button>
      </div>
    </div>
  );
};

export default NavigationBar;
