import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { signupByData } from "../functions/auth/signup";
import { useFormik } from "formik";
import { loginRegisterValidation } from "../validations/auth.validations";

export default function Register() {
  const initialValues = {
    email: "",
    password: "",
  };

  const { values, errors, touched, handleBlur, handleSubmit, handleChange } =
    useFormik({
      initialValues,
      validationSchema: loginRegisterValidation,
      onSubmit: async (values, action) => {
        const { ...data } = values;
        try {
          const response = await signupByData(data);
          if (response) {
            toast.success("User is Signup Success.");
            action.resetForm();
          } else {
            console.log(response);
            toast.error("Signup failed. Please try again.");
          }
        } catch (error) {
          console.error(error);
          toast.error("An error occurred during signup.");
        }
      },
    });

  return (
    <div className="flex h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      {/* Left Blank Space with Animation */}
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
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>Sign Up with email</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                name="email"
                className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-colors duration-300 shadow-sm hover:shadow-md"
              />
              {errors.email && touched.email ? (
                <span className="font-light text-red-500 mb-2">
                  {errors.email}
                </span>
              ) : null}
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
                className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-colors duration-300 shadow-sm hover:shadow-md"
              />
              {errors.password && touched.password ? (
                <span className="font-light text-red-500 mb-2">
                  {errors.password}
                </span>
              ) : null}
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
              Already have an account?
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

// CSS for animation
const styles = `
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out forwards;
}
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
