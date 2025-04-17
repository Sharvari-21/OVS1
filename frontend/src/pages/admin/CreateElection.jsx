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
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center px-4">
      <div className="bg-white/60 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl p-10 w-full max-w-2xl transition-all duration-300">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Create Election
        </h2>

        {message && (
          <p
            className={`text-center mb-6 text-sm font-medium ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Election Name"
            className="w-full px-5 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            value={electionName}
            onChange={(e) => setElectionName(e.target.value)}
            required
          />

          <div>
            <p className="text-lg font-semibold text-gray-700 mb-3">
              Select Candidates:
            </p>
            <div className="grid gap-3 max-h-60 overflow-y-auto pr-2">
              {candidates.map((cand) => (
                <label
                  key={cand.candidate_id}
                  className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(cand.candidate_id)}
                    onChange={() => toggleCandidate(cand.candidate_id)}
                    className="form-checkbox h-5 w-5 text-green-600 transition-all duration-200"
                  />
                  <span className="text-gray-800">
                    {cand.name}{" "}
                    <span className="text-sm text-gray-500">({cand.email})</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              type="submit"
              className="bg-green-600 text-black px-6 py-3 rounded-xl hover:bg-green-500 hover:rounded-full transition-all duration-300 ease-in-out shadow-md"
            >
              Create Election
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateElection;
