import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AppointmentDetail = () => {
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [updating, setUpdating] = useState(false);

    // Fetch chi tiết cuộc hẹn
    useEffect(() => {
        const fetchAppointmentDetail = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:4000/appointments/${id}`,
                    { withCredentials: true }
                );

                if (response.data?.appointment) {
                    setAppointment(response.data.appointment);
                    setStatus(response.data.appointment.status || "");
                } else {
                    throw new Error("Invalid response: Missing appointment data.");
                }
            } catch (error) {
                console.error("Error fetching appointment details:", error);
                alert("Failed to fetch appointment details. Please refresh the page.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentDetail();
    }, [id]);

    // Xử lý cập nhật trạng thái
    const handleStatusChange = async (newStatus) => {
        if (!newStatus || newStatus === appointment?.status) return;

        try {
            setUpdating(true);
            const response = await axios.patch(
                `http://localhost:4000/appointments/${id}`,
                { status: newStatus },
                { withCredentials: true }
            );

            const updatedAppointment = response.data?.appointment;

            if (!updatedAppointment) {
                throw new Error("Invalid response from server: Missing appointment data.");
            }

            setAppointment((prev) => ({
                ...prev,
                status: updatedAppointment.status,
            }));
            setStatus(updatedAppointment.status);

            alert(response.data.message || "Status updated successfully!");
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "An error occurred while updating the status.";
            console.error("Error updating status:", error);
            alert(errorMessage);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!appointment) return <p>Appointment not found.</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-[#0B6477]">Appointment Detail</h2>
            <p>
                <strong>Patient:</strong>{" "}
                {`${appointment?.patient?.firstName || "N/A"} ${appointment?.patient?.lastName || ""}`}
            </p>
            <p>
                <strong>Doctor:</strong>{" "}
                {`${appointment?.workShift?.doctor?.firstName || "N/A"} ${appointment?.workShift?.doctor?.lastName || ""}`}
            </p>
            <p>
                <strong>Date:</strong>{" "}
                {appointment?.workShift?.date
                    ? new Date(appointment?.workShift?.date).toLocaleDateString()
                    : "N/A"}
            </p>
            <p>
                <strong>Time Slot:</strong> {appointment?.workShift?.timeSlot || "N/A"}
            </p>
            <p>
                <strong>Status:</strong>{" "}
                <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="border rounded p-2 mt-2 text-[#14919B] border-[#14919B]"
                    disabled={updating}
                >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Done">Done</option>
                </select>
                {updating && <span className="text-sm text-[#0B6477] ml-2">Updating...</span>}
            </p>
            <p>
                <strong>Notes:</strong> {appointment?.notes || "No notes provided"}
            </p>
        </div>
    );
};

export default AppointmentDetail;




