import React from 'react';

const Button = ({ onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
        >
            {children}
        </button>
    );
};

export default Button;
