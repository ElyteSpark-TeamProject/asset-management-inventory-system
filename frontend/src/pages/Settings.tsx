import React, { useState } from "react";
import { User, Shield, Bell, Key, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, token } = useAuth();
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSendOtp = async () => {
    if (!currentPassword || !newPassword) {
      setMessage({ text: "Please enter current and new password", type: "error" });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ text: "New password must be at least 8 characters", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/auth/send-change-password-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      
      setOtpSent(true);
      setMessage({ text: `OTP Sent! (Dev Mock: ${data.otp})`, type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setMessage({ text: "Please enter the OTP", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");
      
      setMessage({ text: "Password changed successfully!", type: "success" });
      setTimeout(() => {
        setIsChangingPassword(false);
        setOtpSent(false);
        setCurrentPassword("");
        setNewPassword("");
        setOtp("");
        setMessage({ text: "", type: "" });
      }, 3000);
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto dark:text-gray-100">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-100 dark:border-gray-700 p-6 flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Profile Information</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Personal details and application role.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100">
                  {user?.name || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100">
                  {user?.email || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  {user?.role || "Employee"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-100 dark:border-gray-700 p-6 flex items-start gap-4 opacity-60">
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full text-gray-600 dark:text-gray-400">
            <Bell className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              Notifications <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full font-semibold">Coming Soon</span>
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage email and push notification preferences.</p>
          </div>
        </div>

        <div className="p-6 flex items-start gap-4 transition-all">
          <div className={`p-3 rounded-full ${isChangingPassword ? "bg-blue-100 text-blue-600" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
            <Key className="w-6 h-6" />
          </div>
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center w-full">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  Password & Security
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Update your password and secure your account.</p>
              </div>
              {!isChangingPassword && (
                <button 
                  onClick={() => setIsChangingPassword(true)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword && (
              <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                {message.text && (
                  <div className={`mb-4 p-3 rounded-md text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                    {message.text}
                  </div>
                )}
                
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                    <input 
                      type="password" 
                      disabled={otpSent}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                    <input 
                      type="password" 
                      disabled={otpSent}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50" 
                    />
                  </div>

                  {!otpSent ? (
                    <div className="flex gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send OTP"}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { setIsChangingPassword(false); setMessage({text:"", type:""}) }}
                        className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter OTP</label>
                        <input 
                          type="text" 
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button 
                          type="submit" 
                          disabled={loading}
                          className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => { setOtpSent(false); setMessage({text:"", type:""}) }}
                          className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Back
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
