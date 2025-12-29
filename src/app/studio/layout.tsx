import { StudioSidebar } from "./_components/StudioSidebar";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudioSidebar>{children}</StudioSidebar>;
}
