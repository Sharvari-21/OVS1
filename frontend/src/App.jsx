import { Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";

import Home from "./pages/Home";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import VoterDashboard from "./pages/voter/Dashboard";
import AddCandidate from "./pages/admin/AddCandidate";
import CreateElection from "./pages/admin/CreateElection";
import Vote from "./pages/voter/Vote";

// 🆕 New Admin Result Components
import ElectionResults from "./pages/admin/ElectionResults";
import ElectionDetail from "./pages/admin/ElectionDetail";

import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log("✅ App Mounted");
    console.log("🧑‍💻 User Context:", user);
  }, [user]);

  const RequireAuth = ({ children, role }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* ✅ Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <RequireAuth role="admin">
            <AdminDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/add-candidate"
        element={
          <RequireAuth role="admin">
            <AddCandidate />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/create-election"
        element={
          <RequireAuth role="admin">
            <CreateElection />
          </RequireAuth>
        }
      />
      <Route
        path="/results"
        element={
          <RequireAuth role="admin">
            <ElectionResults />
          </RequireAuth>
        }
      />
      <Route
        path="/results/:electionId"
        element={
          <RequireAuth role="admin">
            <ElectionDetail />
          </RequireAuth>
        }
      />

      {/* ✅ Voter Protected Routes */}
      <Route
        path="/voter/dashboard"
        element={
          <RequireAuth role="voter">
            <VoterDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/voter/vote/:electionId"
        element={
          <RequireAuth role="voter">
            <Vote />
          </RequireAuth>
        }
      />

      {/* ✅ Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
