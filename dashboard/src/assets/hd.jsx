import React from 'react';

const HDI = ({ size = 24, className = "", color = "currentColor" }) => {
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
            {/* Hard drive body */}
            <rect x="4" y="10" width="16" height="9" rx="1" />

            {/* Top angled section */}
            <path d="M4 10 L8 5 L17 5 L20 10" fill="none" />

            {/* Power LED indicator */}
            <circle cx="8" cy="15" r="0.5" />

            {/* Front panel slot/line */}
            <line x1="12" y1="15" x2="16" y2="15" />
        </svg>
    );
};

export default HDI