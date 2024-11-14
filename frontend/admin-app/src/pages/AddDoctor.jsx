import React, { useState } from 'react';

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
        address: '',
        specialty: 'Cardiology',
        experience: 0,
        docAvatar: ''
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctorDetails({
            ...doctorDetails,
            [name]: value
        });
    };

    // Cloudinary upload widget setup
    const handleUploadClick = () => {
        const myWidget = window.cloudinary.createUploadWidget(
            {
                cloudName: 'dxclyqubm',
                uploadPreset: 'appointment-app-preset', // Ensure to add your preset here
            },
            (error, result) => {
                if (!error && result && result.event === 'success') {
                    console.log('Upload successful:', result.info);
                    setDoctorDetails({
                        ...doctorDetails,
                        docAvatar: result.info.secure_url // Save the image URL
                    });
                }
            }
        );
        myWidget.open();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit the doctor details to the backend
        console.log('Form Submitted:', doctorDetails);
    };

    return (
        <div className="container mx-auto p-4 bg-white shadow-lg rounded-md max-w-4xl">
            <h1 className="text-3xl font-semibold mb-4 text-center text-gray-800">Add New Doctor</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                    <input
                        type="text"
                        name="firstName"
                        value={doctorDetails.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={doctorDetails.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
                    <input
                        type="email"
                        name="email"
                        value={doctorDetails.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        name="phone"
                        value={doctorDetails.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        value={doctorDetails.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="flex space-x-4">
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
                    <input
                        type="date"
                        name="dob"
                        value={doctorDetails.dob}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        name="specialty"
                        value={doctorDetails.specialty}
                        onChange={handleChange}
                        placeholder="Specialty"
                        required
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
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
                                src={doctorDetails.docAvatar}
                                alt="Doctor Avatar"
                                className="w-32 h-32 object-cover rounded-full"
                            />
                        </div>
                    )}
                </div>
                <div>
                    <textarea
                        name="address"
                        value={doctorDetails.address}
                        onChange={handleChange}
                        placeholder="Address"
                        className="border p-2 rounded w-full"
                    />
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
