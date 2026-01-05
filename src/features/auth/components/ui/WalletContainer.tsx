import React from "react";

interface WalletContainerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode; // Menggunakan ReactNode, bukan HTMLElementType
}

export const WalletContainer = ({
  children,
  className, // Memisahkan className agar bisa digabung jika perlu
  ...props
}: WalletContainerProps) => {
  return (
    <button
      {...props}
      className={`px-4 py-6 w-full cursor-pointer ${className || ""}`}
    >
      {children}
    </button>
  );
};
