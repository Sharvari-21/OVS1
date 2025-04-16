import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const fetchElections = (token) =>
  axios.get(`${API}/voter/elections`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchSingleElection = (token, electionId) =>
  axios.get(`${API}/voter/election/${electionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const submitVote = (token, payload) =>
  axios.post(`${API}/voter/vote`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
