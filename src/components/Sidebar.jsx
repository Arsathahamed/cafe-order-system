import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const role = localStorage.getItem("role");

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-yellow-500 text-black font-semibold"
        : "text-white hover:bg-slate-800"
    }`;

  return (
    <aside className="w-64 bg-slate-900 text-white p-6">

      <h1 className="text-3xl font-bold text-yellow-400">
        OVER
      </h1>

      <p className="text-gray-400 mt-2">
        {role === "admin"
          ? "Admin Panel"
          : "Cashier Panel"}
      </p>

      <nav className="mt-10 space-y-2">

        {/* Admin Only */}
        {role === "admin" && (
          <>
            <NavLink to="/admin/dashboard" className={menuClass}>
              <span>📊</span>
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/admin/products" className={menuClass}>
              <span>🍔</span>
              <span>Products</span>
            </NavLink>
          </>
        )}

        {/* Admin + Cashier */}
        {(role === "admin" || role === "cashier") && (
          <NavLink to="/admin/orders" className={menuClass}>
            <span>🛒</span>
            <span>Orders</span>
          </NavLink>
        )}

        {/* Admin Only */}
        {role === "admin" && (
          <>
            <NavLink to="/kitchen" className={menuClass}>
              <span>👨‍🍳</span>
              <span>Kitchen</span>
            </NavLink>

            <NavLink to="/admin/reports" className={menuClass}>
              <span>📈</span>
              <span>Reports</span>
            </NavLink>

            <NavLink to="/admin/settings" className={menuClass}>
              <span>⚙</span>
              <span>Settings</span>
            </NavLink>
          </>
        )}

      </nav>

    </aside>
  );
}