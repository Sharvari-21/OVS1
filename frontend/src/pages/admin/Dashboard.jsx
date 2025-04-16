import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, Admin</h1>
      <p className="mb-4">Logged in as: {user?.sub}</p>

      <div className="space-y-4">
        <Link
          to="/admin/add-candidate"
          className="block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          ➕ Add Candidate
        </Link>

        <Link
          to="/admin/create-election"
          className="block bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          🗳️ Create Election
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
