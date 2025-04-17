import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Results = () => {
  const { user } = useContext(AuthContext);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/status`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setResults(res.data);
      } catch (err) {
        console.error("❌ Error fetching results:", err);
        setError(
          err.response?.data?.msg || "Failed to fetch election results"
        );
      }
    };

    fetchResults();
  }, [user.token]);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 text-red-500 text-center">
        <p>{error}</p>
      </div>
    );

  if (!results)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-600">
        <p>Loading election results...</p>
      </div>
    );

  if (results.message === "No votes cast yet") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-700">
        <div className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/40 text-center">
          <h2 className="text-2xl font-bold mb-2">Election Results</h2>
          <p>{results.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white/30 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          🗳️ Election Results
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Total Votes Cast: <span className="font-semibold">{results.total_votes}</span>
        </p>

        <div className="space-y-4">
          {Object.entries(results.percentage_results).map(
            ([candidateId, percent]) => (
              <div
                key={candidateId}
                className="transition-all bg-white/40 backdrop-blur-md border border-white/60 shadow-md rounded-xl px-6 py-4 hover:rounded-full hover:shadow-lg"
              >
                <p className="font-semibold text-gray-800 mb-1">
                  Candidate ID: {candidateId}
                </p>
                <p className="text-blue-600 font-bold">{percent}% votes</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
