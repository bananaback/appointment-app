import React from 'react';

const ProtectedPage = () => {
    return (
        (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded shadow-lg">
                    <h2 className="text-3xl font-bold text-center text-indigo-600">Protected Page</h2>
                    <p className="text-center text-gray-600">
                        Welcome to the protected page! Only authenticated users can see this content.
                    </p>
                </div>
            </div>
        )
    );
};

export default ProtectedPage;
