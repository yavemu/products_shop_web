import { FormEvent, ReactNode } from "react";

export interface FormContainerProps {
  title: string;
  onSubmit: (e: FormEvent) => void;
  children: ReactNode;
  className?: string;
}

function FormContainer({ title, onSubmit, children, className = "" }: FormContainerProps) {
  return (
    <div className={`form-container ${className}`}>
      <div className="form-header">
        <h1 className="form-title">{title}</h1>
      </div>

      <form onSubmit={onSubmit} className="form-content">
        {children}
      </form>
    </div>
  );
}

export default FormContainer;
