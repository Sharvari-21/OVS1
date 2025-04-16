import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const decoded = jwtDecode(parsed.token);
        console.log("✅ Decoded user on mount:", decoded);
        setUser({ ...decoded, token: parsed.token });
      } catch (error) {
        console.error("❌ Invalid token found in storage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (token, role) => {
    try {
      const decoded = jwtDecode(token);
      const newUser = { ...decoded, role, token };
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      console.log("✅ User set after login:", newUser);
    } catch (error) {
      console.error("❌ Failed to decode token during login:", error);
    }
  };

  const logout = () => {
    console.log("🚪 Logging out");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
