import { useFormik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { loginByData } from "../functions/auth/login";
import { loginRegisterValidation } from "../validations/auth.validations";

export default function Login() {
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
        const response = await loginByData(data);
        if (response) {
          toast.success("User is Logged Sucessfully.");
          action.resetForm();
        }
      },
    });

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                for="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                name="email"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
              {errors.email && touched.email ? (
                <span className="font-light text-red-400 mb-8">
                  {errors.email}
                </span>
              ) : null}
            </div>

            <div>
              <label
                for="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
              {errors.password && touched.password ? (
                <span className="font-light text-red-400 mb-8">
                  {errors.password}
                </span>
              ) : null}
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
              >
                Log In
              </button>
            </div>
          </form>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>
              Not registered yet?
              <Link to="/user/register" className="text-black hover:underline">
                SignUp here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
