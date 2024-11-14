import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer here
import 'react-toastify/dist/ReactToastify.css';

const EditDoctor = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    // Fetch doctor data when component mounts
    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/doctors/${id}`, {
                    withCredentials: true,
                });
                setDoctor(response.data);
            } catch (err) {
                setError('Failed to fetch doctor data');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorData();
    }, [id]);

    // Handle form submission (update doctor data)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:4000/doctors/${id}`,
                doctor,
                { withCredentials: true }
            );
            toast.success("Doctor updated successfully!");
        } catch (error) {
            toast.error("Failed to update doctor");
        }
    };

    const handleUploadClick = () => {
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET, // Use env variable
                sources: ['local', 'url', 'camera'],
                showAdvancedOptions: true,
                cropping: true,
                multiple: false,
                maxFileSize: 10000000,
                clientAllowedFormats: ['jpg', 'png', 'jpeg'],
            },
            (error, result) => {
                if (result.event === 'success') {
                    setDoctor({
                        ...doctor,
                        docAvatar: { url: result.info.secure_url },
                    });
                    toast.success("Avatar uploaded successfully!");
                } else if (error) {
                    toast.error("Avatar upload failed!");
                }
            }
        );
        widget.open();
    };


    // Handle delete
    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this doctor?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:4000/doctors/${id}`, {
                    withCredentials: true,
                });
                toast.success("Doctor deleted successfully!");

                // Wait for 3 seconds before redirecting
                setTimeout(() => {
                    navigate('/doctors'); // Redirect to doctor list page after deletion
                }, 3000); // 3000 ms = 3 seconds
            } catch (error) {
                toast.error("Failed to delete doctor");
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Edit Doctor - {doctor.firstName} {doctor.lastName}</h2>

            {doctor.docAvatar && doctor.docAvatar.url && (
                <div className="mb-4">
                    <img
                        src={doctor.docAvatar.url}
                        alt={`${doctor.firstName} ${doctor.lastName}`}
                        className="w-32 h-32 object-cover rounded-full"
                    />
                </div>
            )}

            <div className="my-4">
                <button
                    type="button"
                    onClick={handleUploadClick}
                    className="border p-2 rounded bg-blue-500 text-white"
                >
                    Upload Avatar
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        value={doctor.firstName}
                        onChange={(e) => setDoctor({ ...doctor, firstName: e.target.value })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        value={doctor.lastName}
                        onChange={(e) => setDoctor({ ...doctor, lastName: e.target.value })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={doctor.email}
                        onChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        disabled // Disable the field to prevent editing
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="text"
                        id="phone"
                        value={doctor.phone}
                        onChange={(e) => setDoctor({ ...doctor, phone: e.target.value })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Specialty</label>
                    <select
                        id="specialty"
                        value={doctor.specialty}
                        onChange={(e) => setDoctor({ ...doctor, specialty: e.target.value })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="Cardiology">Cardiology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="General Practice">General Practice</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience (in years)</label>
                    <input
                        type="number"
                        id="experience"
                        value={doctor.experience || ''}
                        onChange={(e) => setDoctor({ ...doctor, experience: e.target.value })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    {/* Delete Button */}
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Delete Doctor
                    </button>
                </div>
            </form>

            {/* Add ToastContainer here */}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default EditDoctor;
