import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import API_CONFIG from "../config/api";
import apiService from "../services/api.service";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  async function handleLogin() {
    if (email.length === 0) {
      toast.error("Enter email");
      return;
    }
    if (password.length === 0) {
      toast.error("Enter password");
      return;
    }

    try {
      const loginRes = await apiService.post(API_CONFIG.ENDPOINTS.LOGIN, {
        email,
        password,
      });

      if (loginRes.ok) {
        const data = await loginRes.json();
        const token = data.token;
        localStorage.setItem("token", token);

        setEmail("");
        setPassword("");

        toast.success("Login successful!");
        navigate("/admin/panel", { replace: true });
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 transform transition duration-500 hover:shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-4">
          Log In
        </h1>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              autoComplete="off"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              autoComplete="off"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
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
        </div>

        <div className="mt-6 text-sm text-gray-600 text-center">
          <Link
            to="/change-password"
            className="text-indigo-600 font-medium hover:underline"
          >
            Forget Or Reset Password?
          </Link>
        </div>

        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>
            New here?{" "}
            <Link
              to="/admin/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
