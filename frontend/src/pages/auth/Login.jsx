import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("voter");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        role === "admin" ? "/user/admin/login" : "/user/voter/login";

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = response.data.access_token;
      const decoded = jwtDecode(token); // Decode to extract role info

      login(token, decoded.role); // ✅ Save token + role to context
      console.log("✅ Login successful:", decoded);

      if (decoded.role === "admin") {
        navigate("/admin/dashboard");
      } else if (decoded.role === "voter") {
        navigate("/voter/dashboard");
      } else {
        setError("Unauthorized role");
      }
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Log In</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-2 text-sm font-medium">Role</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="voter">Voter</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="email"
          className="w-full p-2 border rounded mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
