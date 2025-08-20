import React from "react";
import { Loader2 } from "lucide-react";

export interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function LoadingSpinner({ message = "Cargando...", size = "md", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`loading-container ${className}`}>
      <div className="loading-content">
        <Loader2 className={`loading-spinner loading-spinner-${size}`} />
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;