import React from "react";
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";

export interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

function ErrorMessage({ error, onRetry, className = "" }) {
  const getErrorInfo = () => {
    if (error.includes("conexión") || error.includes("red")) {
      return {
        icon: <WifiOff size={48} className="error-icon" />,
        title: "Problema de Conexión",
      };
    }
    if (error.includes("servidor")) {
      return {
        icon: <Wifi size={48} className="error-icon" />,
        title: "Servidor No Disponible",
      };
    }
    return {
      icon: <AlertCircle size={48} className="error-icon" />,
      title: "Oops! Algo salió mal",
    };
  };

  const { icon, title } = getErrorInfo();

  return (
    <div className={`error-message-container ${className}`}>
      <div className="error-content">
        {icon}
        <h3 className="error-title">{title}</h3>
        <p className="error-description">{error}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            <RefreshCw size={16} />
            <span>Intentar nuevamente</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
