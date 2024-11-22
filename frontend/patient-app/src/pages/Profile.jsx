import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch current user's data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/auth/profile`, {
          withCredentials: true,
        });
        const { firstName, lastName, email, phone, dob } = data.user;
        setFormData((prevFormData) => ({
          ...prevFormData,
          firstName,
          lastName,
          email,
          phone,
          dob: dob ? dob.split("T")[0] : "", // Format date if necessary
        }));
      } catch (err) {
        toast.error("Failed to load profile information.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put("http://localhost:4000/auth/profile", formData, {
        withCredentials: true,
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "An error occurred while updating profile.";
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto p-8 rounded-xl shadow-lg"
      style={{ backgroundColor: "#EAF4F4" }}
    >
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Update Your Profile
      </h2>

      {/* Toast Notification Container */}
      <ToastContainer />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name and Last Name */}
        <div className="flex gap-6">
          <div className="flex-1">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none"
              style={{ backgroundColor: "#FFFFFF" }}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none"
              style={{ backgroundColor: "#FFFFFF" }}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none"
            style={{ backgroundColor: "#FFFFFF" }}
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none"
            style={{ backgroundColor: "#FFFFFF" }}
            required
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none"
            style={{ backgroundColor: "#FFFFFF" }}
            required
          />
        </div>

        {/* Current Password */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none"
            style={{ backgroundColor: "#FFFFFF" }}
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none"
            style={{ backgroundColor: "#FFFFFF" }}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none"
            style={{ backgroundColor: "#FFFFFF" }}
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full py-3 font-medium rounded-lg"
            style={{ backgroundColor: "#118AB2", color: "#FFFFFF" }}
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
