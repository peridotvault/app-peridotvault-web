import clsx from "clsx";
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...rest }, ref) => {
    return (
      <div className="w-full flex flex-col gap-2">
        {label && <label htmlFor="">{label}</label>}
        <input
          ref={ref}
          {...rest}
          className={clsx(
            className,
            "w-full duration-300",
            "py-2.5 px-3",
            "border rounded-lg outline-none",
            "hover:bg-foreground/2 focus:bg-foreground/5",
          )}
        />
      </div>
    );
  },
);

Input.displayName = "Input";
