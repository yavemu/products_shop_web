import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { OrderProcessState, OrderProcessStep } from "@/lib/helpers/orderProcess";

interface OrderProcessStatusProps {
  state: OrderProcessState;
  className?: string;
}

const stepIcons: Record<OrderProcessStep, React.ReactNode> = {
  "creating-customer": <Loader2 className="loading-spinner loading-spinner-md" />,
  "creating-delivery": <Loader2 className="loading-spinner loading-spinner-md" />,
  "creating-order": <Loader2 className="loading-spinner loading-spinner-md" />,
  "processing-payment": <Loader2 className="loading-spinner loading-spinner-md" />,
  "completed": <CheckCircle size={32} className="text-green-600" />,
  "error": <XCircle size={32} className="text-red-600" />
};

function OrderProcessStatus({ state, className = "" }: OrderProcessStatusProps) {
  if (!state.isProcessing && state.currentStep !== "completed" && state.currentStep !== "error") {
    return null;
  }

  return (
    <div className={`order-process-status ${className}`}>
      <div className="process-content">
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