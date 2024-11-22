import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(3);

  // Fetch user's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:4000/appointments", {
          withCredentials: true,
        });
        setAppointments(response.data.appointments || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Handle canceling an appointment
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:4000/appointments/${appointmentId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Appointment canceled successfully!");
      setAppointments((prev) =>
        prev.filter((appointment) => appointment._id !== appointmentId)
      );
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error("Failed to cancel the appointment.");
    }
  };

  // Pagination logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      className="max-w-5xl mx-auto p-8 rounded-3xl shadow-lg"
      style={{ backgroundColor: "#EAF4F4" }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        My Appointments
      </h2>
      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments found.</p>
      ) : (
        <div className="space-y-6">
          {currentAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="flex items-center justify-between p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow bg-white"
            >
              {/* Doctor Avatar */}
              <img
                src={
                  appointment.workShift.doctor.docAvatar?.url ||
                  "/placeholder-avatar.png"
                }
                alt={`${appointment.workShift.doctor.firstName} ${appointment.workShift.doctor.lastName}`}
                className="w-16 h-16 rounded-full object-cover border border-gray-300"
              />

              {/* Appointment Details */}
              <div className="flex-1 ml-6">
                <p className="text-lg font-medium text-gray-800">
                  {appointment.workShift.doctor.firstName}{" "}
                  {appointment.workShift.doctor.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  Specialty: {appointment.workShift.doctor.specialty}
                </p>
                <p className="text-sm text-gray-500">
                  Date: {appointment.workShift.date}
                </p>
                <p className="text-sm text-gray-500">
                  Time: {appointment.workShift.timeSlot}
                </p>
                <p className="text-sm text-gray-500">
                  Status: {appointment.status}
                </p>
                <p className="text-sm text-gray-500">
                  Description:{" "}
                  {appointment.notes.length > 50
                    ? `${appointment.notes.substring(0, 50)}...`
                    : appointment.notes}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => handleCancelAppointment(appointment._id)}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg text-sm ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-400 hover:bg-gray-500 text-white"
          }`}
        >
          Previous
        </button>
        <span className="text-sm font-medium">
          Page {currentPage} of{" "}
          {Math.ceil(appointments.length / appointmentsPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(appointments.length / appointmentsPerPage)
          }
          className={`px-4 py-2 rounded-lg text-sm ${
            currentPage === Math.ceil(appointments.length / appointmentsPerPage)
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-400 hover:bg-gray-500 text-white"
          }`}
        >
          Next
        </button>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default MyAppointments;
