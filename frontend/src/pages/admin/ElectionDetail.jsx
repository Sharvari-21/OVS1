import { useEffect, useState, useC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function ElectionDetail() {
  const { user } = useContext(AuthContext);
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [error, setError] = useState("");

  const fetchElection = async () => {
    try {
      // const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/admin/election/${electionId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      setElection(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch election", err);
      setError("Failed to fetch election details.");
    }
  };

  useEffect(() => {
    if (electionId) {
      fetchElection();
    }
  }, [electionId]);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  if (!election)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
        <p className="text-gray-600">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6 flex justify-center items-center">
      <div className="bg-white/30 backdrop-blur-md shadow-xl border border-white/40 rounded-2xl p-8 max-w-xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          🗳️ {election.election_name}
        </h2>

        <h4 className="text-xl font-medium text-gray-700 mb-3">Candidates</h4>
        <ul className="space-y-4">
          {election.candidates.map((candidate) => (
            <li
              key={candidate.candidate_id}
              className="flex justify-between items-center p-4 bg-white/40 border border-white/50 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <div>
                <p className="font-semibold text-gray-900">{candidate.name}</p>
                <p className="text-sm text-gray-600">{candidate.email}</p>
              </div>
              <span className="text-green-700 font-bold">{candidate.votes} votes</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:rounded-full hover:bg-green-700 shadow-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ElectionDetail;
