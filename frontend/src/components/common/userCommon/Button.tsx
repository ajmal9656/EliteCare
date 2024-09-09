import React from "react";

interface ButtonProps {
  title: string;
  onClick: () => void; 
}

const Button: React.FC<ButtonProps> = ({ title, onClick }) => {
  return (
    <div>
      <button
        onClick={onClick} // Attach the onClick handler
        className="bg-brightColor text-white px-4 py-2 rounded-md hover:bg-hoverColor transition duration-300 ease-in-out"
      >
        {title}
      </button>
    </div>
  );
};

export default Button;

