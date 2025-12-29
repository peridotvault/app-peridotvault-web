import React, { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`
            px-4 py-2 rounded-md border
            bg-background text-foreground
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-accent/50
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all duration-200
            ${error ? "border-destructive focus:ring-destructive/50" : "border-border"}
            ${className}
          `}
          {...props}
        />

        {error && (
          <span className="text-xs text-destructive">{error}</span>
        )}

        {helperText && !error && (
          <span className="text-xs text-muted-foreground">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
