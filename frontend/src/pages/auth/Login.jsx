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
      const decoded = jwtDecode(token);

      login(token, decoded.role);
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
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg text-white p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6">Login</h2>

        {error && (
          <p className="text-red-400 text-center mb-4 font-medium">{error}</p>
        )}

        <label className="block mb-1 text-sm font-medium">Role</label>
        <select
          className="w-full px-4 py-3 mb-4 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="voter">Voter</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 mb-4 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 mb-6 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg hover:rounded-full transition-all duration-300 text-black font-medium shadow-md"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
