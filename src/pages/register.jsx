import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { loginRegisterValidation } from "../validations/auth.validations";
import API_CONFIG from "../config/api";
import ApiService from "../services/api.service";

export default function Register() {
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const { values, errors, touched, handleBlur, handleSubmit, handleChange, resetForm } =
    useFormik({
      initialValues,
      validationSchema: loginRegisterValidation,
      onSubmit: async (values, action) => {
        try {
          const response = await ApiService.post(API_CONFIG.ENDPOINTS.SIGNUP, values);
          
          if (response.ok) {
            toast.success("User signup successful!");
            action.resetForm();
            
            setTimeout(() => {
              navigate("/admin/login", { replace: true });
            }, 1500);
          } else {
            const errorData = await response.json();
            toast.error(errorData.message || "Signup failed. Please try again.");
          }
        } catch (error) {
          console.error(error);
          toast.error("An error occurred during signup.");
        }
      },
    });

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return (
    <div className="flex h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black rounded-l-lg shadow-2xl p-8 animate-fadeIn">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to Our Service!</h1>
          <p className="text-gray-600 mt-2">
            Join us in simplifying bus bookings. Let's get started!
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
            Sign Up
          </h1>
          <h2 className="text-sm font-medium mb-4 text-gray-600 text-center">
            Your journey starts with a click: Simplifying bus bookings, one ticket at a time.
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                name="email"
                autoComplete="off"
                className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-colors duration-300 shadow-sm hover:shadow-md"
              />
              {errors.email && touched.email && (
                <span className="block font-light text-red-500 mt-1 text-sm">
                  {errors.email}
                </span>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-colors duration-300 shadow-sm hover:shadow-md"
              />
              {errors.password && touched.password && (
                <span className="block font-light text-red-500 mt-1 text-sm">
                  {errors.password}
                </span>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Sign Up
              </button>
            </div>
          </form>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>
              Already have an account?{" "}
              <Link to="/admin/login" className="text-purple-600 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}