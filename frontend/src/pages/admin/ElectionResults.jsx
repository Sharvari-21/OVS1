import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const ElectionResults = () => {
  const { user } = useContext(AuthContext);
  const [elections, setElections] = useState([]);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        // const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/admin/elections", {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });
        setElections(res.data);
      } catch (err) {
        console.error("Failed to fetch elections", err);
      }
    };

    fetchElections();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex justify-center items-start p-8">
      <div className="w-full max-w-2xl bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🗳️ Election Results
        </h2>

        {elections.length === 0 ? (
          <p className="text-gray-600 text-center">No elections found.</p>
        ) : (
          <div className="space-y-4">
            {elections.map((election) => (
              <Link
                key={election.election_id}
                to={`/results/${election.election_id}`}
                className="block text-center text-gray-800 font-medium bg-white/40 border border-white/60 px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:rounded-full hover:bg-white/70 hover:shadow-lg"
              >
                🗳️ {election.election_name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionResults;
