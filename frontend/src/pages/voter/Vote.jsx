import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Vote = () => {
  const { user } = useContext(AuthContext);
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/voter/election/${electionId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setElection(res.data);
      } catch (err) {
        console.error("❌ Error fetching election:", err);
        setMessage({ type: "error", text: "Failed to load election" });
      }
    };

    fetchElection();
  }, [electionId, user.token]);

  const handleVote = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/voter/vote`,
        {
          election_id: electionId,
          candidate_id: selectedCandidate,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setMessage({ type: "success", text: res.data.message });

      // Redirect after short delay
      setTimeout(() => {
        navigate("/voter/dashboard");
      }, 1500); // optional: 1.5s to let the user see the success message
    } catch (err) {
      console.error("❌ Error voting:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Vote failed",
      });
    }
  };

  if (!election)
    return (
      <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex justify-center items-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-8 flex justify-center items-start">
      <div className="w-full max-w-xl bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          🗳️ Vote in: {election.election_name}
        </h2>

        {message && (
          <p
            className={`mb-4 text-sm ${
              message.type === "error" ? "text-red-500" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="space-y-4">
          {election.candidates.map((candidate) => (
            <label
              key={candidate.candidate_id}
              className="flex items-center bg-white/40 border border-white/60 rounded-xl px-4 py-3 shadow-md transition-all hover:shadow-lg cursor-pointer"
            >
              <input
                type="radio"
                name="candidate"
                value={candidate.candidate_id}
                onChange={(e) => setSelectedCandidate(e.target.value)}
                checked={selectedCandidate === candidate.candidate_id}
                className="mr-3 accent-blue-600"
              />
              <span className="text-gray-800 font-medium">{candidate.name}</span>
            </label>
          ))}
        </div>

        <button
          onClick={handleVote}
          disabled={!selectedCandidate}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:rounded-full hover:bg-blue-700 shadow-md disabled:opacity-50"
        >
          Submit Vote
        </button>
      </div>
    </div>
  );
};

export default Vote;
