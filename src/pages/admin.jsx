import { useEffect } from "react";
import NavigationBar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export function AdminPanel() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/admin/login");
    }
  });
  return (
    <div>
      <NavigationBar />
      ADMIN
    </div>
  );
}
