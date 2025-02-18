import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function handleLogin() {
    if (email.length === 0) {
      toast.error("Enter email");
      return;
    }
    if (password.length === 0) {
      toast.error("Enter password");
      return;
    }

    const loginUrl = "https://busticketingsystem-1.onrender.com/auth/login";
    const loginRes = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (loginRes.ok) {
      const data = await loginRes.json();
      const token = data.token;
      localStorage.setItem("token", token);
      navigate("/admin/panel");
    } else {
      toast.error("Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 transform transition duration-500 hover:shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-4">
          Log In
        </h1>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              onChange={handleEmailChange}
              name="email"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handlePasswordChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-300"
            />
          </div>
          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600 text-center">
          <Link to="/change-password" className="text-indigo-600 font-medium hover:underline">
            Forget Password?
          </Link>
        </div>
        
        {/* Sign Up Link */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>
            New here?{" "}
            <Link to="/admin/register" className="text-indigo-600 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
