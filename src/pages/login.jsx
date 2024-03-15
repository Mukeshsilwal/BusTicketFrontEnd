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
    console.log(email, password);
    const loginUrl = "http://localhost:8089/auth/login";
    const loginRes = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    console.log(loginRes);
    if (loginRes.ok) {
      const data = await loginRes.json();
      const token = data.token;
      localStorage.setItem("token", token);
      navigate('/admin/panel')
    } else {
      toast.error("Invalid email or password");
    }
  }

  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex items-center justify-center flex-1 bg-gray-100 text-black">
        <div className="max-w-lg text-center">
          <img
            className="h-[500px]"
            src="https://img.freepik.com/premium-vector/simple-buss-traansportation-logo-design_569344-386.jpg?w=2000"
            alt="loginImg"
          />
        </div>
      </div>
      <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <h1 className="text-3xl font-semibold mb-6 text-black text-center">
            Log In
          </h1>
          <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
            Your journey starts with a click: Simplifying bus bookings, one
            ticket at a time.
          </h1>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>Log In with email</p>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              onChange={handleEmailChange}
              name="email"
              className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
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
              type="password"
              id="password"
              name="password"
              onChange={handlePasswordChange}
              className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            />
          </div>
          <div>
            <button
              onClick={handleLogin}
              className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
            >
              Log In
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>
              Not registered yet?
              <Link to="/admin/register" className="text-black hover:underline">
                SignUp here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
