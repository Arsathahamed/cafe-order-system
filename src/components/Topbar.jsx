import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Topbar({ setSidebarOpen }) {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("role");
    localStorage.removeItem("last_activity");
    localStorage.removeItem("expires_at");

    if (role === "admin") {
      navigate("/admin/login", { replace: true });
    } else if (role === "cashier") {
      navigate("/cashier/login", { replace: true });
    } else if (role === "kitchen") {
      navigate("/kitchen/login", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="bg-white shadow-sm px-4 py-4 flex items-center justify-between">

      {/* Left */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        <h2 className="text-lg md:text-2xl font-bold">
          OVER Dashboard
        </h2>

      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        <span className="hidden sm:block font-medium">
          👤 {role === "admin"
            ? "Admin"
            : role === "cashier"
            ? "Cashier"
            : "Kitchen"}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>

      </div>

    </header>
  );
}