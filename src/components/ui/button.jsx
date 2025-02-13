import React from "react";

export const Button = ({ children, variant = "default", className = "", ...props }) => {
  const baseStyles = "px-6 py-2 rounded-lg font-medium transition duration-200";
  const variants = {
    default: "bg-teal-500 text-white hover:bg-teal-600",
    outline: "border border-teal-400 text-teal-400 hover:bg-teal-500 hover:text-white",
    ghost: "text-gray-300 hover:bg-gray-800 hover:text-white",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};


