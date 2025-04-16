import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔍 Checking token in localStorage:", token);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("✅ Decoded token on mount:", decoded);
        setUser({ ...decoded, token });
      } catch (error) {
        console.error("❌ Failed to decode token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token) => {
    console.log("🔐 Logging in with token:", token);
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode(token);
      console.log("✅ Token decoded after login:", decoded);
      setUser({ ...decoded, token });
    } catch (error) {
      console.error("❌ Failed to decode token during login:", error);
    }
  };

  const logout = () => {
    console.log("🚪 Logging out");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
