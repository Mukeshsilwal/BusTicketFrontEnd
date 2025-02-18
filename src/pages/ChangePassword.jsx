import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(""); 
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleOtpChange = (e) => setOtp(e.target.value);

  async function handleSendOtp() {
    const sendOtpUrl = "https://busticketingsystem-1.onrender.com/auth/sent-otp"; 
    const token = localStorage.getItem("token");
    const response = await fetch(sendOtpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username: email }),
    });

    if (response.ok) {
      toast.success("OTP sent to your email");
      setOtpModalVisible(true); 
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to send OTP");
    }
  }

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    const changePasswordUrl = "https://busticketingsystem-1.onrender.com/auth/change-password";
    const token = localStorage.getItem("token");

    const response = await fetch(changePasswordUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: email,
        oldPassword,
        newPassword,
        confirmPassword,
        otp, 
      }),
    });

    if (response.ok) {
      toast.success("Password changed successfully");
      navigate("/admin/login");
    } else {
      const errorData = await response.json();
      toast.error(errorData.message );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 transform transition duration-500 hover:shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
          Change Password
        </h2>

        <form className="space-y-6">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-300"
          />
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={handleOldPasswordChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-300"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-300"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-300"
          />

          <button
            type="button"
            onClick={handleSendOtp}
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
          >
            Send OTP
          </button>
        </form>
      </div>

      {otpModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-semibold text-center mb-4">Enter OTP</h3>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={handleOtpChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-300"
            />
            <button
              type="button"
              onClick={() => {
                setOtpModalVisible(false); 
                handleChangePassword(); 
              }}
              className="w-full mt-4 bg-green-600 text-white p-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300"
            >
              Change Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
