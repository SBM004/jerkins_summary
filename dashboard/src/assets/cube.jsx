const CubeIcon = ({ size = 24, className = "", color = "currentColor", strokeWidth = "1" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            strokeLinejoin="round"
            className={className}
        >
            {/* Top face */}
            <path d="M12 4 L19 7 L12 10 L5 7 Z" fill="none" />

            {/* Left face */}
            <path d="M5 7 L5 17 L12 20 L12 10 Z" fill="none" />

            {/* Right face */}
            <path d="M12 10 L12 20 L19 17 L19 7 Z" fill="none" />

            {/* Top face division line */}
            <line x1="8.2" y1="5.3" x2="16.3" y2="8.5" />
        </svg>
    );
};

export default CubeIcon