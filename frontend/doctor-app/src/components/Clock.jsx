import React, { useState, useEffect } from "react";

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer); 
    }, []);

    return (
        <div
            className="absolute bg-[#0AD1C8] text-white px-6 py-3 rounded-lg shadow-lg text-xl font-medium flex items-center space-x-3"
            style={{
                top: "10%",
                right: "5%",
            }}
        >
            <span role="img" aria-label="clock">
                ⏰
            </span>
            <span>{time.toLocaleTimeString()}</span>
        </div>
    );
};

export default Clock;
