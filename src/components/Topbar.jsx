import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Topbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("last_activity");
    localStorage.removeItem("expires_at");

   navigate("/admin/login", { replace: true });
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h2 className="font-bold text-xl">
        OVER Dashboard
      </h2>

      <div className="flex items-center gap-4">
        <span>👤 Admin</span>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </header>
  );
}