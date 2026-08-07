import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 async function handleLogin(e) {
  e.preventDefault();

  setLoading(true);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    await supabase.auth.signOut();
    alert("Profile not found.");
    return;
  }

  if (profile.role !== "kitchen") {
    await supabase.auth.signOut();
    alert("Access denied.");
    return;
  }

  localStorage.setItem("role", profile.role);
  localStorage.setItem("last_activity", Date.now());
  localStorage.setItem("expires_at", Date.now() + 60 * 60 * 1000);

  navigate("/kitchen");
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-xl">

        <h1 className="text-4xl text-center font-bold text-yellow-500">
          OVER
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Kitchen Login
        </p>

        <form onSubmit={handleLogin} className="space-y-4 mt-8">

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button
            className="w-full bg-yellow-500 text-white p-3 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
}