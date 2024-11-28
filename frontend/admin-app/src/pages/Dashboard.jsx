import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import axios from "axios";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalAppointments: 0,
        appointmentsToday: 0,
        pendingAppointments: 0,
        totalDoctors: 0,
        totalPatients: 0,
        availableShifts: 0,
    });

    const [recentAppointments, setRecentAppointments] = useState([]);
    const [roleDistribution, setRoleDistribution] = useState({});

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get("http://localhost:4000/admins/stat", {
                withCredentials: true,
            });

            const data = response.data;

            setStats({
                totalAppointments: data.totalAppointments,
                appointmentsToday: data.appointmentsToday,
                pendingAppointments: data.pendingAppointments,
                totalDoctors: data.totalDoctors,
                totalPatients: data.totalPatients,
                availableShifts: data.availableShifts,
            });

            setRecentAppointments(data.recentAppointments || []);
            setRoleDistribution(data.roleDistribution || {});

            console.log(data);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const barChartData = {
        labels: recentAppointments.map(
            (appt) => `${appt.patient.firstName} ${appt.patient.lastName}`
        ),
        datasets: [
            {
                label: "Pending Appointments",
                data: recentAppointments.map(() => 1), // Each appointment represents one count
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };

    const pieChartData = {
        labels: Object.keys(roleDistribution),
        datasets: [
            {
                label: "Role Distribution",
                data: Object.values(roleDistribution),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                hoverOffset: 4,
            },
        ],
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Visual overview of the system.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                {[{
                    label: "Total Appointments",
                    value: stats.totalAppointments
                },
                {
                    label: "Appointments Today",
                    value: stats.appointmentsToday
                },
                {
                    label: "Pending Appointments",
                    value: stats.pendingAppointments
                },
                {
                    label: "Total Doctors",
                    value: stats.totalDoctors
                },
                {
                    label: "Total Patients",
                    value: stats.totalPatients
                },
                {
                    label: "Available Shifts",
                    value: stats.availableShifts
                }].map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 shadow-md rounded-lg text-center"
                    >
                        <h2 className="text-lg font-semibold text-gray-700">{stat.label}</h2>
                        <p className="text-xl font-bold text-indigo-600">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">


                <div className="bg-white p-4 shadow-md rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Role Distribution
                    </h2>
                    <Pie data={pieChartData} />
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Recent Appointments
                </h2>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="px-4 py-2 text-left">Patient</th>
                                <th className="px-4 py-2 text-left">Time Slot</th>
                                <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAppointments.map((appt, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{`${appt.patient.firstName} ${appt.patient.lastName}`}</td>
                                    <td className="px-4 py-2">{appt.workShift.timeSlot}</td>
                                    <td className="px-4 py-2">{appt.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
