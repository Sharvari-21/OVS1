import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Vote = () => {
  const { user } = useContext(AuthContext);
  const { electionId } = useParams();
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
    } catch (err) {
      console.error("❌ Error voting:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Vote failed",
      });
    }
  };

  if (!election) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Vote in: {election.election_name}
      </h2>

      {message && (
        <p
          className={`mb-4 ${
            message.type === "error" ? "text-red-500" : "text-green-600"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="space-y-3">
        {election.candidates.map((candidate) => (
          <div key={candidate.candidate_id} className="flex items-center">
            <input
              type="radio"
              name="candidate"
              value={candidate.candidate_id}
              onChange={(e) => setSelectedCandidate(e.target.value)}
              checked={selectedCandidate === candidate.candidate_id}
              className="mr-2"
            />
            <label>{candidate.name}</label>
          </div>
        ))}
      </div>

      <button
        onClick={handleVote}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        disabled={!selectedCandidate}
      >
        Submit Vote
      </button>
    </div>
  );
};

export default Vote;
