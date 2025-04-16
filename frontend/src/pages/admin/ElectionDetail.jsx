import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get election_id from URL
import axios from "axios";

function ElectionDetail() {
  const { electionId } = useParams(); // Access the electionId from the URL
  const [election, setElection] = useState(null);
  const [error, setError] = useState("");

  const fetchElection = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/admin/election/${electionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data)
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

  if (error) return <p>{error}</p>;
  if (!election) return <p>Loading...</p>;

  return (
    <div>
      <h2>🗳️ {election.election_name}</h2>
      <h4>Candidates:</h4>
      <ul>
        {election.candidates.map((candidate) => (
          <li key={candidate.candidate_id}>
            {candidate.name} ({candidate.email}) — {candidate.votes} votes
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ElectionDetail;
