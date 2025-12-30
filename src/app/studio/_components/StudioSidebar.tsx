"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faGamepad, faUsers } from "@fortawesome/free-solid-svg-icons";
import { StudioProfileDropdown } from "@/features/studio/_components/StudioProfileDropdown";

export function StudioSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/studio", label: "Dashboard", icon: faHome },
    { href: "/studio/games", label: "My Games", icon: faGamepad },
    { href: "/studio/team", label: "Team", icon: faUsers },
  ];

  return (
    <div className="flex min-h-screen bg-card">
      {/* Sidebar - Fixed Width */}
      <aside className="w-60 bg-card border-r border-border flex flex-col fixed h-full">
        {/* Header - Simple & Clean */}
        <div className="px-6 py-5 border-b border-border">
          <h1 className="text-xl font-bold text-accent">Studio</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Game Management</p>
        </div>

        {/* Navigation - Minimalis */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/studio" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-all duration-200
                      ${isActive
                        ? "bg-accent text-white font-medium"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }
                    `}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-4 text-center" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile Section - Wallet Integration */}
        <div className="px-3 py-4 border-t border-border">
          <StudioProfileDropdown />
        </div>
      </aside>

      {/* Main Content - Fixed Margin */}
      <main className="flex-1 ml-60">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
