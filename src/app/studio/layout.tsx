"use client";

import { StudioSidebar } from "./_components/StudioSidebar";
import { ProtectStudioRoute } from "@/shared/middleware/ProtectStudioRoute";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectStudioRoute>
      <StudioSidebar>{children}</StudioSidebar>
    </ProtectStudioRoute>
  );
}
