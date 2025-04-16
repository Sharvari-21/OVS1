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
      <div className="p-6 text-red-500 text-center">
        <p>{error}</p>
      </div>
    );

  if (!results)
    return (
      <div className="p-6 text-center">
        <p>Loading election results...</p>
      </div>
    );

  if (results.message === "No votes cast yet") {
    return (
      <div className="p-6 text-center text-gray-700">
        <h2 className="text-xl font-semibold mb-2">Election Results</h2>
        <p>{results.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Election Results</h2>
      <p className="mb-4 text-gray-600">Total Votes: {results.total_votes}</p>

      <div className="space-y-4">
        {Object.entries(results.percentage_results).map(
          ([candidateId, percent]) => (
            <div
              key={candidateId}
              className="p-4 bg-white shadow rounded border border-gray-200"
            >
              <p className="font-semibold">Candidate ID: {candidateId}</p>
              <p className="text-blue-600 font-bold">{percent}% votes</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Results;
