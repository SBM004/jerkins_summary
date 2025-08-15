import React,{useState} from "react";
import {
 useNavigate,Link
} from "react-router-dom";
export const SignUp=(props)=>{
    const navigate=useNavigate();
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const handleregister=(e)=>{
        const result=fetch("http://localhost:3000/register",{
            method:"POST",
            headers:{
                "Content-Type":"Application/json"
            },
            body:JSON.stringify({
                "email":email,
                "password":password
            })
        })

        if(result.ok){
            navigate("/login");
        }
    }
    return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">SignUP</h2>
        <form onSubmit={handleregister}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              email
            </label>
            <input
              id="email"
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
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
            Sign UP
          </button>

          <Link to="/login">login</Link>
        </form>
      </div>
    </div>
  );
}
