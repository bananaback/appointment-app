import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import Appointment from "./AppointmentForm";

const MyAppointments = () => {
  const { userId } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);

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
  }, [userId]);

  // Handle updating an appointment
  const handleUpdateAppointment = (appointment) => {
    setIsEditing(true);
    setAppointmentToEdit(appointment);
  };

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

  if (isEditing) {
    return (
      <Appointment
        initialData={appointmentToEdit} // Pass existing appointment data
        onClose={() => {
          setIsEditing(false);
          setAppointmentToEdit(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        My Appointments
      </h2>
      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="flex items-center justify-between p-4 border rounded-md shadow-sm hover:shadow-md"
            >
              {/* Doctor Avatar */}
              <img
                src={
                  appointment.workShift.doctor.docAvatar?.url ||
                  "/placeholder-avatar.png"
                }
                alt={`${appointment.workShift.doctor.firstName} ${appointment.workShift.doctor.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
              />

              {/* Appointment Details */}
              <div className="flex-1 ml-4">
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
                  Description:{" "}
                  {appointment.notes.length > 50
                    ? `${appointment.notes.substring(0, 50)}...`
                    : appointment.notes}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleUpdateAppointment(appointment)}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleCancelAppointment(appointment._id)}
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default MyAppointments;
