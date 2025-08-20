import { Loader2, CheckCircle, XCircle, X } from "lucide-react";
import { OrderProcessState, OrderProcessStep } from "@/lib/hooks/useOrderProcess";

interface OrderProcessStatusProps {
  state: OrderProcessState;
  className?: string;
  onClose?: () => void;
}

const stepIcons: Record<OrderProcessStep, React.ReactNode> = {
  "creating-customer": <Loader2 className="loading-spinner loading-spinner-md" />,
  "creating-delivery": <Loader2 className="loading-spinner loading-spinner-md" />,
  "creating-order": <Loader2 className="loading-spinner loading-spinner-md" />,
  "processing-payment": <Loader2 className="loading-spinner loading-spinner-md" />,
  "completed": <CheckCircle size={32} className="text-green-600" />,
  "error": <XCircle size={32} className="text-red-600" />
};

function OrderProcessStatus({ state, className = "", onClose }: OrderProcessStatusProps) {
  if (!state.isProcessing && state.currentStep !== "completed" && state.currentStep !== "error") {
    return null;
  }

  return (
    <div className={`order-process-status ${className}`}>
      <div className="process-content">
        {(state.currentStep === "error" || state.currentStep === "completed") && onClose && (
          <button 
            onClick={onClose}
            className="close-button"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        )}
        <div className="process-icon">
          {stepIcons[state.currentStep]}
        </div>
        <div className="process-info">
          <p className="process-message">{state.message}</p>
          {state.error && (
            <p className="process-error">{state.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderProcessStatus;