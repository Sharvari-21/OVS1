import { Link } from "react-router-dom";

const Navbar = () => {
  console.log("🧭 Navbar rendering");

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600">🗳️ Voting System</div>
      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
