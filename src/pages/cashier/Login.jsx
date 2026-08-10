import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { toast } from "react-toastify";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLogIn,
} from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Invalid email or password");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        await supabase.auth.signOut();
        toast.error("Profile not found.");
        return;
      }

      if (profile.role !== "cashier") {
        await supabase.auth.signOut();
        toast.warning("Access denied.");
        return;
      }

      localStorage.setItem("role", profile.role);
      localStorage.setItem("last_activity", Date.now());
      localStorage.setItem("expires_at", Date.now() + 60 * 60 * 1000);

      toast.success("Welcome back, Cashier!");

      setTimeout(() => {
        navigate("/admin/orders");
      }, 800);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-yellow-500">
            OVER
          </h1>

          <p className="text-gray-500 mt-2">
            Cashier Login
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="mt-10 space-y-5"
        >

          <div className="relative">
            <FiMail className="absolute left-4 top-4 text-gray-400 text-lg" />

            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-4 text-gray-400 text-lg" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-500"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              <>
                <FiLogIn />
                Login
              </>
            )}
          </button>

        </form>

        <p className="text-center text-gray-400 text-sm mt-8">
          © {new Date().getFullYear()} OVER POS
        </p>

      </div>
    </div>
  );
}