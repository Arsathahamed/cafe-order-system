import { Link } from "react-router-dom";
import logo from "../../assets/over-logo.jpeg";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#031931] flex items-center justify-center">

      <div className="text-center px-6">

        <img
          src={logo}
          alt="OVER"
          className="w-72 md:w-[450px] mx-auto"
        />

        <p className="text-gray-300 text-lg mt-6">
          Fresh • Hot • Delicious
        </p>

        <Link
          to="/menu"
          className="inline-block mt-10 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-10 py-4 rounded-full transition"
        >
          View Menu
        </Link>

      </div>

    </div>
  );
}