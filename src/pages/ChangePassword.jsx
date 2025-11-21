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

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter email");
      return;
    }

    const sendOtpUrl = "http://localhost:8089/auth/sent-otp";
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
      toast.success("OTP sent");
      setOtpModalVisible(true);
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || "OTP sending failed");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // Determine mode: CHANGE_PASSWORD or RESET_PASSWORD
    const resetPasswordMode = oldPassword
      ? "CHANGE_PASSWORD"
      : "RESET_PASSWORD";

    const url = "http://localhost:8089/auth/change-password";
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        resetPassword: resetPasswordMode,
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
      toast.error(errorData.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
          Change Password
        </h2>

        <form className="space-y-6">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md"
          />

          {/* Show old password only if user wants normal change */}
          <input
            type="password"
            placeholder="Old Password (leave empty if forgot)"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-3 border rounded-md"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border rounded-md"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded-md"
          />

          {/* If old password empty → user wants RESET mode → show Send OTP */}
          {!oldPassword && (
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full bg-blue-600 text-white p-3 rounded-md"
            >
              Send OTP
            </button>
          )}

          {/* If old password entered → directly change without OTP */}
          {oldPassword && (
            <button
              type="button"
              onClick={handleChangePassword}
              className="w-full bg-green-600 text-white p-3 rounded-md"
            >
              Change Password
            </button>
          )}
        </form>
      </div>

      {/* OTP modal for RESET PASSWORD */}
      {otpModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold text-center mb-2">Enter OTP</h3>

            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-md"
            />

            <button
              onClick={() => {
                setOtpModalVisible(false);
                handleChangePassword();
              }}
              className="w-full mt-3 bg-green-600 text-white p-3 rounded-md"
            >
              Verify OTP & Change Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
