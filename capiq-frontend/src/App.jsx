
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

import LoginSignup from "./pages/LoginSignup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AcademicProfile from "./pages/AcademicProfile.jsx";
import ResumeStudio from "./pages/ResumeStudio.jsx";
import Courses from "./pages/Courses.jsx";
import "./App.css";

function ProtectedRoute({ loggedIn }) {
  return loggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  // Start logged out whenever the app opens or refreshes.
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  function handleLogin(user) {
    localStorage.setItem("capiqLoggedIn", "true");
    localStorage.setItem("capiqUser", JSON.stringify(user));

    setLoggedIn(true);
    navigate("/", { replace: true });
  }

  function handleLogout() {
    localStorage.removeItem("capiqLoggedIn");
    localStorage.removeItem("capiqUser");
    localStorage.removeItem("capiq_token");

    setLoggedIn(false);
    navigate("/login", { replace: true });
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          loggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <LoginSignup onLogin={handleLogin} />
          )
        }
      />

      <Route element={<ProtectedRoute loggedIn={loggedIn} />}>
        <Route
          path="/"
          element={<Dashboard onLogout={handleLogout} />}
        />
        <Route
          path="/academic-profile"
          element={<AcademicProfile />}
        />
        <Route path="/resume" element={<ResumeStudio />} />
        <Route path="/courses" element={<Courses />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
