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
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Available Elections</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-4">
        {elections.map((election) => (
          <li
            key={election.election_id}
            className="border p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">
                {election.election_name}
              </h3>
              <p>{election.candidates.length} candidates</p>
            </div>
            <button
              onClick={() =>
                navigate(`/voter/vote/${election.election_id}`)
              }
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Vote
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoterDashboard;
