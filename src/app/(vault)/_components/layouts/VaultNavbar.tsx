"use client";

import { Dropdown, OptionComponent } from "@/shared/components/ui/Dropdown";
import { SearchInput } from "@/shared/components/ui/SearchInput";
import { STYLE_PADDING } from "@/shared/constants/style";
import { useState } from "react";

export const VaultNavbar = () => {
  const [query, setQuery] = useState("");
  const options: OptionComponent[] = [
    {
      label: "Lisk",
      value: "lisk-testnet",
      imageUrl: "/images/chains/lisk.svg",
    },
    {
      label: "Base",
      value: "base-testnet",
      imageUrl: "/images/chains/base.svg",
    },
  ];
  return (
    <nav className={"border-y border-border bg-card py-2 " + STYLE_PADDING}>
      <div className="flex justify-between max-w-400 mx-auto">
        <div className=""></div>
        <div className="flex items-center gap-2">
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
