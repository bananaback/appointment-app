import React from 'react';

const Dashboard = () => {
    return (
        <div className="bg-gray-100 h-full py-10 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Dashboard Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
                    <p className="text-lg text-gray-600">Overview of the system. Content coming soon!</p>
                </div>

                {/* Cards for Dashboard Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-semibold text-gray-700">Total Doctors</h2>
                        <p className="text-gray-500 mt-2">Number of doctors registered in the system.</p>
                        <div className="mt-4 text-2xl font-bold text-blue-600">25</div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-semibold text-gray-700">Total Admins</h2>
                        <p className="text-gray-500 mt-2">Number of admins managing the system.</p>
                        <div className="mt-4 text-2xl font-bold text-green-600">5</div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-semibold text-gray-700">Recent Activities</h2>
                        <p className="text-gray-500 mt-2">Latest actions performed by users.</p>
                        <div className="mt-4 text-2xl font-bold text-yellow-600">No recent activity</div>
                    </div>
                </div>

                {/* Add More Info Section */}
                <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-700">User Information</h2>
                    <p className="text-lg text-gray-600 mt-4">This section will contain more details about the user. Placeholder content for now.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
