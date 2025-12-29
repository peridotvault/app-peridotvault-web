"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faGamepad, faPlusCircle, faCog } from "@fortawesome/free-solid-svg-icons";

export function StudioSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/studio", label: "Dashboard", icon: faHome },
    { href: "/studio/games", label: "My Games", icon: faGamepad },
    { href: "/studio/games/new", label: "Create New", icon: faPlusCircle },
    { href: "/studio/settings", label: "Settings", icon: faCog },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-accent">Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">Game Management</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/studio" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-accent text-white shadow-flat-sm"
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

        {/* User Info (placeholder) */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-accent font-semibold">U</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Developer</p>
              <p className="text-xs text-muted-foreground">developer@peridot.dev</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {navItems.find((item) => pathname === item.href || pathname.startsWith(item.href))?.label ||
                  "Studio"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-accent transition"
              >
                View Store →
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
