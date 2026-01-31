"use client";

import { Dropdown, OptionComponent } from "@/shared/components/ui/Dropdown";
import { SearchInput } from "@/shared/components/ui/SearchInput";
import {
  CHAIN_CONFIGS,
  CHAIN_OPTIONS_BY_NETWORK,
  DEFAULT_CHAIN_KEYS,
  getChainKeyForNetwork,
} from "@/shared/constants/chain";
import { STYLE_PADDING } from "@/shared/constants/style";
import { ChainKey } from "@/shared/types/chain";
import { useState } from "react";
import { useChainStore } from "@/shared/states/chain.store";
import { useNetworkStore } from "@/shared/states/network.store";

export const VaultNavbar = () => {
  const [query, setQuery] = useState("");
  const { chainKey, setChain } = useChainStore();
  const { network } = useNetworkStore();
  const options: OptionComponent[] = CHAIN_OPTIONS_BY_NETWORK[network];
  const selectedChain =
    CHAIN_CONFIGS[getChainKeyForNetwork(chainKey, network)] ??
    CHAIN_CONFIGS[DEFAULT_CHAIN_KEYS[network]];
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
              placeholder={selectedChain.name}
              placeholderImage={selectedChain.icon}
              onChange={(option) => {
                setChain(option.value as ChainKey);
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
