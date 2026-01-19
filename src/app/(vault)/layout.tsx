import { VaultNavbar } from "../../shared/components/layouts/VaultNavbar";

export default function VaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`antialiased flex flex-col`}>
      <VaultNavbar />
      {children}
    </div>
  );
}
