import React from "react";

interface WalletButtonContainerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode; // Menggunakan ReactNode, bukan HTMLElementType
}

export const WalletButtonContainer = ({
  children,
  className, // Memisahkan className agar bisa digabung jika perlu
  ...props
}: WalletButtonContainerProps) => {
  return (
    <button
      {...props}
      className={`p-4 w-full cursor-pointer text-lg font-medium disabled:cursor-not-allowed ${
        className || ""
      }`}
    >
      {children}
    </button>
  );
};
