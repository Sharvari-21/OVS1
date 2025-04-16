// src/services/voterService.js
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Voter fetches list of active elections
export const getAvailableElections = () => {
  return axios.get(`${API}/voter/elections`, getAuthHeader());
};

// Voter casts a vote
export const voteInElection = (electionId, candidateId) => {
  return axios.post(
    `${API}/voter/vote`,
    { election_id: electionId, candidate_id: candidateId },
    getAuthHeader()
  );
};

// Voter checks if already voted in a specific election
export const hasVoted = (electionId) => {
  return axios.get(`${API}/voter/has-voted/${electionId}`, getAuthHeader());
};
