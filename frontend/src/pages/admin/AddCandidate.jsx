import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const AddCandidate = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ for redirect
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
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Candidate</h2>
      {message && (
        <p
          className={`${
            message.type === "error" ? "text-red-500" : "text-green-600"
          } mb-4`}
        >
          {message.text}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Candidate Name"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Candidate
          </button>

          {/* ✅ Redirect button */}
          <button
            type="button"
            onClick={goToCreateElection}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Go to Create Election
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCandidate;
