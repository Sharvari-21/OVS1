import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-white to-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-md shadow-lg rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome, Admin</h1>
        <p className="text-gray-600 mb-6">Logged in as: <span className="font-semibold">{user?.sub}</span></p>

        <div className="space-y-4">
          <Link
            to="/admin/add-candidate"
            className="block w-full text-center bg-pink-600 hover:bg-blue-500 text-white py-3 px-6 rounded-lg hover:rounded-full transition-all duration-300 shadow-md"
          >
            Add Candidate
          </Link>

          <Link
            to="/admin/create-election"
            className="block w-full text-center bg-pink-600 hover:bg-green-500 text-white py-3 px-6 rounded-lg hover:rounded-full transition-all duration-300 shadow-md"
          >
            Create Election
          </Link>

          <Link
            to="/results"
            className="block w-full text-center bg-pink-600 hover:bg-purple-500 text-white py-3 px-6 rounded-lg hover:rounded-full transition-all duration-300 shadow-md"
          >
            View Results
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
