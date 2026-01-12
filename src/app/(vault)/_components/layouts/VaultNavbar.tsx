"use client";

import { Dropdown, OptionComponent } from "@/shared/components/ui/Dropdown";
import { SearchInput } from "@/shared/components/ui/SearchInput";
import { useState } from "react";

export const VaultNavbar = () => {
  const [query, setQuery] = useState("");
  const options: OptionComponent[] = [
    {
      label: "Lisk",
      value: "lisk-testnet",
      imageUrl: "/images/chains/lisk.svg",
    },
  ];
  return (
    <nav className="border-y border-border bg-card p-2">
      <div className="flex justify-between max-w-400 mx-auto">
        <div className=""></div>
        <div className="flex items-center gap-3">
          <SearchInput
            value={query}
            placeholder="Search Game..."
            onChange={setQuery}
          />
          <div>
            <Dropdown
              options={options}
              placeholderImage={"/images/chains/lisk.svg"}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
