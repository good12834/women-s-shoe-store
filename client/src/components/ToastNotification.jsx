import React, { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const ToastNotification = ({
  show,
  onClose,
  message,
  type = "success",
  duration = 4000,
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // Wait for animation to complete
  };

  const getToastConfig = () => {
    switch (type) {
      case "success":
        return {
          bg: "success",
          icon: <CheckCircleIcon width={20} height={20} />,
          title: "Success",
        };
      case "error":
        return {
          bg: "danger",
          icon: <XCircleIcon width={20} height={20} />,
          title: "Error",
        };
      case "warning":
        return {
          bg: "warning",
          icon: <ExclamationCircleIcon width={20} height={20} />,
          title: "Warning",
        };
      case "info":
        return {
          bg: "info",
          icon: <InformationCircleIcon width={20} height={20} />,
          title: "Information",
        };
      default:
        return {
          bg: "success",
          icon: <CheckCircleIcon width={20} height={20} />,
          title: "Success",
        };
    }
  };

  const config = getToastConfig();

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      <Toast
        show={isVisible}
        onClose={handleClose}
        bg={config.bg}
        autohide={duration > 0}
        delay={duration}
        className="toast-premium"
      >
        <Toast.Header closeButton={true} className="toast-header">
          <div className={`rounded me-2 bg-${config.bg} text-white p-1`}>
            {config.icon}
          </div>
          <strong className="me-auto">{config.title}</strong>
        </Toast.Header>
        <Toast.Body
          className={type === "success" || type === "info" ? "text-white" : ""}
        >
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;
