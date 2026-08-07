import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useEffect, useState } from "react";
export default function AdminLayout() {
  const navigate = useNavigate();
const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem("last_activity", Date.now());
    };

    window.addEventListener("click", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("touchstart", updateActivity);

    const interval = setInterval(async () => {
      const lastActivity = Number(localStorage.getItem("last_activity"));
      const role = localStorage.getItem("role");

      const ONE_HOUR = 60 * 60 * 1000;

if (!lastActivity || Date.now() - lastActivity > ONE_HOUR) {

  await supabase.auth.signOut();

  localStorage.removeItem("role");
  localStorage.removeItem("last_activity");
  localStorage.removeItem("expires_at");

  alert("Your session has expired. Please login again.");

  if (role === "cashier") {
    navigate("/cashier/login", { replace: true });
  } else {
    navigate("/admin/login", { replace: true });
  }
}
    }, 60000);

    return () => {
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("touchstart", updateActivity);

      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
 <Sidebar
  isOpen={sidebarOpen}
  setIsOpen={setSidebarOpen}
/>

<div className="flex-1 flex flex-col md:ml-64">
  <Topbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}