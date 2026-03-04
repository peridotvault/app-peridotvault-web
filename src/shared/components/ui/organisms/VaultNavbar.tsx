"use client";

import {
  Dropdown,
  OptionComponent,
} from "@/shared/components/ui/atoms/Dropdown";
import { SearchInput } from "@/shared/components/ui/molecules/SearchInput";
import { STYLE_PADDING } from "@/shared/constants/style";
import { useState } from "react";
import { useGetChains } from "@/features/chain/hooks/useGetChain";
import { useNetwork } from "@/features/setting/hooks/useNetwork";
import { useSelectedChain } from "@/features/setting/hooks/useSelectedChain";

export const VaultNavbar = () => {
  const [query, setQuery] = useState("");

  const { network } = useNetwork();
  const { chains } = useGetChains();
  const { chainId, setSelectedChain } = useSelectedChain();

  const filteredChains = chains.filter((c) => {
    if (network === "testnet") return c.is_testnet;
    if (network === "mainnet") return !c.is_testnet;
    return true;
  });

  const selectedChain =
    filteredChains.find((c) => c.caip_2_id === chainId) ?? filteredChains[0];

  const options: OptionComponent[] = filteredChains.map((c) => ({
    value: c.caip_2_id,
    label: c.name,
    imageUrl: c.icon_url,
  }));

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
              placeholder={selectedChain?.name}
              placeholderImage={selectedChain?.icon_url}
              onChange={(option) => {
                setSelectedChain(option.value);
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
