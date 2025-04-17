import { Link } from "react-router-dom";

const Navbar = () => {
  console.log("🧭 Navbar rendering");

  return (
    <nav className="bg-white/20 backdrop-blur-md shadow-lg py-4 px-8 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      <div className="text-2xl font-extrabold text-white drop-shadow-md">🗳️ Voting System</div>
      <div className="space-x-4">
        <Link
          to="/login"
          className="transition-all duration-300 bg-white/30 text-white px-5 py-2 rounded-lg hover:bg-white hover:text-gray-900 hover:rounded-full shadow-sm hover:shadow-md"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="transition-all duration-300 bg-white/10 text-white px-5 py-2 rounded-lg border border-white/30 hover:bg-white hover:text-gray-900 hover:rounded-full shadow-sm hover:shadow-md"
        >
          Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
