import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const AddCandidate = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/add-candidate`,
        form,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage({ type: "success", text: response.data.message });
      setForm({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("❌ Error adding candidate:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Something went wrong",
      });
    }
  };

  const goToCreateElection = () => {
    navigate("/admin/create-election");
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center px-4">
      <div className="bg-white/60 backdrop-blur-md shadow-xl rounded-3xl p-10 w-full max-w-lg border border-gray-200 transition-all duration-300">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Add Candidate
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
            name="name"
            placeholder="Candidate Name"
            className="w-full px-5 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-5 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-5 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button
              type="submit"
              className="bg-green-600 text-black px-6 py-3 rounded-xl transition-all duration-300 ease-in-out hover:bg-green-500 hover:rounded-full shadow-md w-full sm:w-auto"
            >
              Add Candidate
            </button>
            <button
              type="button"
              onClick={goToCreateElection}
              className="bg-blue-600 text-black px-6 py-3 rounded-xl transition-all duration-300 ease-in-out hover:bg-blue-500 hover:rounded-full shadow-md w-full sm:w-auto"
            >
              Go to Create Election
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidate;
