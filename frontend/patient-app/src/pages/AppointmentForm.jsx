import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Appointment = () => {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [workShifts, setWorkShifts] = useState([]);
  const [selectedWorkShift, setSelectedWorkShift] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  // Fetch specialties
  useEffect(() => {
    const fetchedSpecialties = [
      "Cardiology",
      "Pediatrics",
      "Neurology",
      "Orthopedics",
      "General Practice",
    ];
    setSpecialties(fetchedSpecialties);
  }, []);

  // Fetch doctors based on specialty
  useEffect(() => {
    if (!selectedSpecialty) return;

    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:4000/doctors", {
          params: { specialty: selectedSpecialty },
          withCredentials: true,
        });
        if (Array.isArray(response.data.doctors)) {
          setDoctors(response.data.doctors);
        } else {
          console.error("Expected an array of doctors, but got:", response.data.doctors);
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, [selectedSpecialty]);

  // Fetch available time slots based on selected doctor and date
  useEffect(() => {
    if (!selectedDoctor || !appointmentDate) {
      setWorkShifts([]);
      return;
    }

    const formattedDate = appointmentDate.toISOString().split("T")[0]; // Format date as yyyy-MM-dd

    const fetchWorkShifts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/workshifts", {
          params: {
            doctorId: selectedDoctor._id,
            startDate: formattedDate,
            endDate: formattedDate,
          },
          withCredentials: true,
        });
        setWorkShifts(response.data || []);
      } catch (error) {
        console.error("Error fetching workShifts:", error);
        setWorkShifts([]);
      }
    };

    fetchWorkShifts();
  }, [selectedDoctor, appointmentDate]);

  const handleAddAppointment = async () => {
    if (!selectedSpecialty || !selectedDoctor || !appointmentDate || !selectedWorkShift || !notes) {
      toast.error("Please fill in all fields!");
      return;
    }

    const newAppointment = {
      workShiftId: selectedWorkShift,
      notes: notes,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/appointments",
        newAppointment,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success("Appointment added successfully!");

        // Clear form fields
        setSelectedSpecialty("");
        setSelectedDoctor(null);
        setAppointmentDate(new Date());
        setNotes("");
        setSelectedWorkShift("");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Error creating appointment. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Book an Appointment
      </h2>

      {/* Appointment Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Appointment Date
        </label>
        <DatePicker
          selected={appointmentDate}
          onChange={(date) => setAppointmentDate(date)}
          dateFormat="yyyy/MM/dd"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Specialty */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Specialty
        </label>
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">--Select a Specialty--</option>
          {specialties.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Doctor */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Doctor
        </label>
        <select
          value={selectedDoctor ? selectedDoctor._id : ""}
          onChange={(e) => {
            const selectedDoctorId = e.target.value;
            const doctor = doctors.find((doc) => doc._id === selectedDoctorId);
            setSelectedDoctor(doctor);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">--Select a Doctor--</option>
          {doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.firstName} {doctor.lastName}
            </option>
          ))}
        </select>
      </div>

       {/* Doctor Avatar */}
       <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Doctor Avatar
        </label>
        {selectedDoctor && selectedDoctor.docAvatar?.url ? (
          <img
            className="w-40 h-40 object-cover rounded-full mx-auto"
            src={selectedDoctor.docAvatar.url}
            alt={`${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
          />
        ) : (
          <div className="w-40 h-40 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-gray-500">
            No Avatar Available
          </div>
        )}
      </div>

      {/* Time Slots */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time Slots
        </label>
        <div className="flex flex-wrap gap-2">
          {workShifts.length === 0 ? (
            <p className="text-sm text-gray-500">
              Select a doctor and date to see time slots, or no time slots available.
            </p>
          ) : (
            workShifts.map((workShift) => (
              <button
                key={workShift._id}
                type="button"
                className={`px-4 py-2 rounded-md text-white font-medium ${workShift.isReserved
                    ? "bg-gray-400 cursor-not-allowed"
                    : selectedWorkShift === workShift._id
                    ? "bg-blue-500"
                    : "bg-green-500 hover:bg-green-600"
                  }`}
                onClick={() => setSelectedWorkShift(workShift._id)}
                disabled={workShift.isReserved}
              >
                {workShift.timeSlot}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Add any additional notes..."
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleAddAppointment}
        className="w-full py-3 font-medium rounded-lg"
        style={{ backgroundColor: "#118AB2", color: "#FFFFFF" }}
      >
        Add Appointment
      </button>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Appointment;
