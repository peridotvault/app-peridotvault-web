"use client";

import React, { useState } from "react";

export interface Tab {
  id: string;
  label: string | React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: "underline" | "pills";
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onTabChange,
  variant = "underline",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onTabChange?.(tabId);
    }
  };

  const activeTabContent = tabs.find((t) => t.id === activeTab)?.content;

  if (variant === "pills") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={`
                px-4 py-2 rounded-md font-medium text-sm
                transition-all duration-200
                flex items-center gap-2
                ${
                  activeTab === tab.id
                    ? "bg-accent text-white shadow-flat-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }
                ${tab.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">{activeTabContent}</div>
      </div>
    );
  }

  // Underline variant (default)
  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-border">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={`
                py-3 px-1 font-medium text-sm relative
                transition-all duration-200
                flex items-center gap-2
                ${
                  activeTab === tab.id
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }
                ${tab.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">{activeTabContent}</div>
    </div>
  );
};
