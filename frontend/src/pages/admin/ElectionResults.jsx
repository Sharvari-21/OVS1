import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ElectionResults = () => {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const token = localStorage.getItem("token");
        // console('hello')
        const res = await axios.get("http://localhost:5000/admin/elections", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data)
        setElections(res.data);
      } catch (err) {
        console.error("Failed to fetch elections", err);
      }
    };

    fetchElections();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Election Results</h2>
      {elections.map((election) => (
        <Link
          key={election.election_id}
          to={`/results/${election.election_id}`}
          className="block border p-4 mb-3 rounded hover:bg-gray-100"
        >
          🗳️ {election.election_name}
        </Link>
      ))}
    </div>
  );
};

export default ElectionResults;
