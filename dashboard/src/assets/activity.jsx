import React from 'react';

const Activity = ({ size = 24, className = "", color = "currentColor" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Heartbeat/pulse line */}
            <path d="M3 12 L4 12 L9 12 L11 18 L13 6 L15 12 L21 12" fill="none" />
        </svg>
    );
};

export default Activity