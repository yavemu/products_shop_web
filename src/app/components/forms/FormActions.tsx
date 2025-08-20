import { ReactNode } from "react";

export interface FormAction {
  type: "submit" | "button";
  variant: "primary" | "secondary" | "danger";
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface FormActionsProps {
  actions: FormAction[];
  className?: string;
}

function FormActions({ actions, className = "" }: FormActionsProps) {
  const getButtonClass = (variant: FormAction["variant"]) => {
    const baseClass = "form-action-btn";
    const variantClasses = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      danger: "btn-danger",
    };
    return `${baseClass} ${variantClasses[variant]}`;
  };

  return (
    <div className={`form-actions ${className}`}>
      {actions.map((action, index) => (
        <button
          key={index}
          type={action.type}
          onClick={action.onClick}
          disabled={action.disabled || action.loading}
          className={getButtonClass(action.variant)}
        >
          {action.loading ? <span className="loading-spinner" /> : action.icon && action.icon}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}

export default FormActions;
