import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddDoctor = () => {
    const [doctorDetails, setDoctorDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: 'Doctor',
        dob: '',
        gender: 'Male',
        address: { street: '', city: '', state: '', zip: '' },
        specialty: 'Cardiology',
        experience: 0,
        docAvatar: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1];
            setDoctorDetails((prevDetails) => ({
                ...prevDetails,
                address: {
                    ...prevDetails.address,
                    [addressField]: value
                }
            }));
        } else {
            setDoctorDetails({
                ...doctorDetails,
                [name]: value
            });
        }
    };

    const handleUploadClick = () => {
        const myWidget = window.cloudinary.createUploadWidget(
            {
                cloudName: 'dxclyqubm',
                uploadPreset: 'appointment-app-preset',
            },
            (error, result) => {
                if (!error && result && result.event === 'success') {
                    console.log('Upload successful:', result.info);

                    // Set both public_id and url in docAvatar
                    setDoctorDetails((prevDetails) => ({
                        ...prevDetails,
                        docAvatar: {
                            public_id: result.info.public_id,
                            url: result.info.secure_url
                        }
                    }));

                    toast.success("Avatar uploaded successfully!");
                }
            }
        );
        myWidget.open();
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!doctorDetails.docAvatar) {
            toast.error("Please upload an avatar before submitting.");
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:4000/doctors',
                doctorDetails,
                {
                    withCredentials: true,  // Ensure cookies are included
                }
            );
            toast.success("Doctor added successfully!");
            setDoctorDetails({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                role: 'Doctor',
                dob: '',
                gender: 'Male',
                address: { street: '', city: '', state: '', zip: '' },
                specialty: 'Cardiology',
                experience: 0,
                docAvatar: ''
            });
        } catch (error) {
            if (error.response) {
                console.error(`Error ${error.response.status}: ${error.response.statusText}`);
                console.error('Backend Error Details:', error.response.data);
                toast.error(`Error ${error.response.status}: ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                console.error('No response received from server:', error.request);
                toast.error("No response received from server");
            } else {
                console.error('Error creating the request:', error.message);
                toast.error("Error creating the request");
            }
        }
    };


    return (
        <div className="container mx-auto p-4 bg-white shadow-lg rounded-md max-w-4xl">
            <ToastContainer />
            <h1 className="text-3xl font-semibold mb-4 text-center text-gray-800">Add New Doctor</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                    <div className="w-full">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={doctorDetails.firstName}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div className="w-full">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={doctorDetails.lastName}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={doctorDetails.email}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={doctorDetails.phone}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={doctorDetails.password}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="flex space-x-4">
                    <div className="w-full">
                        <label>Gender</label>
                        <select
                            name="gender"
                            value={doctorDetails.gender}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={doctorDetails.dob}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="w-full">
                        <label>Street</label>
                        <input
                            type="text"
                            name="address.street"
                            value={doctorDetails.address.street}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div className="w-full">
                        <label>City</label>
                        <input
                            type="text"
                            name="address.city"
                            value={doctorDetails.address.city}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="w-full">
                        <label>State</label>
                        <input
                            type="text"
                            name="address.state"
                            value={doctorDetails.address.state}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div className="w-full">
                        <label>ZIP Code</label>
                        <input
                            type="text"
                            name="address.zip"
                            value={doctorDetails.address.zip}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>
                <div>
                    <label>Specialty</label>
                    <select
                        name="specialty"
                        value={doctorDetails.specialty}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    >
                        <option value="Cardiology">Cardiology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="General Practice">General Practice</option>
                    </select>
                </div>
                <div>
                    <label>Years of Experience</label>
                    <input
                        type="number"
                        name="experience"
                        value={doctorDetails.experience}
                        onChange={handleChange}
                        placeholder="Years of Experience"
                        required
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="my-4">
                    <button
                        type="button"
                        onClick={handleUploadClick}
                        className="border p-2 rounded bg-blue-500 text-white"
                    >
                        Upload Avatar
                    </button>
                    {doctorDetails.docAvatar && (
                        <div className="mt-2">
                            <img
                                src={doctorDetails.docAvatar.url}
                                alt="Doctor Avatar"
                                className="w-32 h-32 object-cover rounded-full"
                            />
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-green-500 text-white p-2 rounded w-full"
                >
                    Add Doctor
                </button>
            </form>
        </div>
    );
};

export default AddDoctor;
