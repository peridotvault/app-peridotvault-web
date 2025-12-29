import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses = "font-semibold rounded-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed";

    const variantClasses = {
      primary: "bg-accent hover:shadow-flat-lg text-white",
      secondary: "bg-muted hover:bg-muted/80 text-foreground",
      outline: "border-2 border-accent text-accent hover:bg-accent hover:text-white",
      ghost: "hover:bg-muted/40 text-foreground",
      danger: "bg-destructive hover:shadow-flat-lg text-white",
    };

    const sizeClasses = {
      sm: "px-4 py-1.5 text-sm",
      md: "px-6 py-2 text-base",
      lg: "px-10 py-2.5 text-lg",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
