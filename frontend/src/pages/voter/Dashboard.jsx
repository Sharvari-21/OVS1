import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const VoterDashboard = () => {
  const { user } = useContext(AuthContext);
  const [elections, setElections] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/voter/elections`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setElections(res.data);
      } catch (err) {
        console.error("❌ Error fetching elections:", err);
        setError("Failed to load elections");
      }
    };

    fetchElections();
  }, [user.token]);

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-8 flex justify-center">
      <div className="w-full max-w-3xl bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">🗳️ Available Elections</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <ul className="space-y-5">
          {elections.map((election) => (
            <li
              key={election.election_id}
              className="flex justify-between items-center p-5 bg-white/40 border border-white/60 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{election.election_name}</h3>
                <p className="text-sm text-gray-600">{election.candidates.length} candidates</p>
              </div>
              <button
                onClick={() => navigate(`/voter/vote/${election.election_id}`)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg transition-all duration-300 hover:rounded-full hover:bg-blue-700 shadow"
              >
                Vote
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VoterDashboard;
