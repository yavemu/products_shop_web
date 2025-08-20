import { ReactNode } from "react";

export interface FormSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

function FormSection({ title, icon, children, className = "" }: FormSectionProps) {
  return (
    <div className={`form-section ${className}`}>
      <h2 className="section-title">
        {icon && icon}
        <span>{title}</span>
      </h2>
      <div className="form-grid">{children}</div>
    </div>
  );
}

export default FormSection;
