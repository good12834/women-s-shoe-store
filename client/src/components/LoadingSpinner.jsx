import React from "react";

const LoadingSpinner = ({
  size = "md",
  text = "Loading...",
  className = "",
}) => {
  const sizeClasses = {
    sm: "spinner-border-sm",
    md: "",
    lg: "spinner-border-lg",
    xl: "spinner-border-xl",
  };

  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center p-4 ${className}`}
    >
      <div className={`spinner-premium ${sizeClasses[size]} mb-3`}></div>
      {text && <p className="text-muted mb-0">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
