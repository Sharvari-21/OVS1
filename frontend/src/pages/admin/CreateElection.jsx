// src/pages/admin/CreateElection.jsx
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const CreateElection = () => {
  const { user } = useContext(AuthContext);
  const [electionName, setElectionName] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/candidates`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setCandidates(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch candidates", err);
      }
    };

    fetchCandidates();
  }, [user.token]);

  const toggleCandidate = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!electionName || selectedIds.length === 0) {
      setMessage({ type: "error", text: "Please fill all fields" });
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/create-election`,
        {
          election_name: electionName,
          candidate_ids: selectedIds,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage({ type: "success", text: res.data.message });
      setElectionName("");
      setSelectedIds([]);
    } catch (err) {
      console.error("❌ Failed to create election", err);
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Something went wrong",
      });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Election</h2>
      {message && (
        <p className={`${message.type === "error" ? "text-red-500" : "text-green-600"} mb-4`}>
          {message.text}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Election Name"
          className="w-full border p-2 rounded"
          value={electionName}
          onChange={(e) => setElectionName(e.target.value)}
          required
        />

        <div>
          <p className="font-medium mb-2">Select Candidates:</p>
          <div className="grid gap-2">
            {candidates.map((cand) => (
              <label key={cand.candidate_id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(cand.candidate_id)}
                  onChange={() => toggleCandidate(cand.candidate_id)}
                />
                <span>{cand.name} ({cand.email})</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Create Election
        </button>
      </form>
    </div>
  );
};

export default CreateElection;
