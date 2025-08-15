import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar.jsx";
import PackagePage from "./pages/package.jsx";
import LoginPage from "./pages/Login.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {!isAuthenticated ? (
        // Only show login page, no navbar
        <Routes>
          <Route
            path="*"
            element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
          />
        </Routes>
      ) : (
        // Show navbar and main app after login
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<PackagePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
