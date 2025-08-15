import React, { useState } from "react";
import {Link} from "react-router-dom"
export default function LoginPage({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async(e) => {
    e.preventDefault(); // stop page reload
    // TODO: Add authentication logic here
    if (username && password) {
    const result=await fetch("http://localhost:3000/login",{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
      },
      credentials:"include",
      body:JSON.stringify({
        "email":username,
        "password":password
      })


    })

    if(result.ok){
      setIsAuthenticated(true)
      console.log(result.message)
    }

    
    
      // Set authenticated to true
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <Link to="/register">register</Link>
      </div>
    </div>
  );
}
