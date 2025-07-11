import React from 'react';

const ChartIcon = ({ size = 24, className = "", color = "currentColor" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Vertical bars */}
            <line x1="9" y1="10" x2="9" y2="17" />
            <line x1="15" y1="7" x2="15" y2="17" />
            <line x1="21" y1="4" x2="21" y2="17" />

            {/* Bottom horizontal line */}
            <path d="M3 3 L3 18 Q3 21 6 21 L21 21" stroke={color} strokeWidth="2" fill="none" />
        </svg>
    );
};

export default ChartIcon;

// Example usage