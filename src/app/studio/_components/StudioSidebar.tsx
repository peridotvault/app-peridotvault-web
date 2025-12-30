"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faGamepad, faUsers, faGear } from "@fortawesome/free-solid-svg-icons";

export function StudioSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/studio", label: "Dashboard", icon: faHome },
    { href: "/studio/games", label: "My Games", icon: faGamepad },
    { href: "/studio/settings", label: "Team", icon: faUsers },
  ];

  return (
    <div className="flex min-h-screen bg-card">
      {/* Sidebar - Fixed Width */}
      <aside className="w-60 bg-card border-r border-border flex flex-col fixed h-full">
        {/* Header - Simple & Clean */}
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-accent">Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">Game Management</p>
        </div>

        {/* Navigation - Minimalis */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/studio" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-lg
                      transition-colors duration-200
                      ${
                        isActive
                          ? "bg-accent text-white shadow-flat-sm border-l-4 border-accent"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    `}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile Section - Avatar + Name + Settings Icon Only */}
        <div className="p-4 border-t border-border">
          <div className="relative flex items-center gap-3 px-2 py-2">
            {/* Avatar - Simple Circle */}
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-semibold">D</span>
            </div>

            {/* User Name */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Developer</p>
            </div>

            {/* Settings Icon */}
            <button
              className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors duration-200"
              title="Settings"
            >
              <FontAwesomeIcon icon={faGear} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content - Fixed Margin */}
      <main className="flex-1 ml-60">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
