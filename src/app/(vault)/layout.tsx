export default function VaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={`antialiased flex flex-col`}>{children}</div>;
}
