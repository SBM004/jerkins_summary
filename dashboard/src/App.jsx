import { useState,useEffect } from "react";
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
import {SignUp }from "./pages/signup.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(()=>{
          const hasToken = document.cookie.split("; ").some(row => row.startsWith("token="));

      if (hasToken) {
        setIsAuthenticated(true);

      } else {
        console.log("no cookie");
        setIsAuthenticated(false)

      }
  },[])
  return (
    <Router>
      {!isAuthenticated ? (
        // Only show login page, no navbar
        <Routes>
          <Route
            path="/login"
            element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
            
          />
          <Route path="/register" element={<SignUp setIsAuthenticated={setIsAuthenticated}/>} />
          <Route path="*" element={<Navigate to="/login"/>} />
        </Routes>
      ) : (
        // Show navbar and main app after login
        <>
          <Navbar setIsAuthenticated={setIsAuthenticated}/>
          <Routes>
            <Route path="/packages" element={<PackagePage />} />
            <Route path="*" element={<Navigate to="/packages" />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
