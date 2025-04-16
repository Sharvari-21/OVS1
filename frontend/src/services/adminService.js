import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const addCandidate = async (candidateData) => {
  return await axios.post(`${API}/admin/add-candidate`, candidateData, getAuthHeader());
};

export const createElection = async (electionData) => {
  return await axios.post(`${API}/admin/create-election`, electionData, getAuthHeader());
};

export const getAllElections = async () => {
  return await axios.get(`${API}/admin/elections`, getAuthHeader());
};

export const getElectionById = async (id) => {
  return await axios.get(`${API}/admin/election/${id}`, getAuthHeader());
};

export const getStatus = async () => {
  return await axios.get(`${API}/admin/status`, getAuthHeader());
};
