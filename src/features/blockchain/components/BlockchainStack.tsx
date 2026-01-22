import { ChainConfig } from "@/shared/types/chain";
import React from "react";

export const BlockchainStack = ({ chain }: { chain: ChainConfig[] }) => {
  return (
    <div className="flex -space-x-2 overflow-hidden">
      {chain.map((item, index) => (
        <div
          key={index}
          className="inline-block size-8 rounded-full ring-2 ring-gray-900 outline -outline-offset-1 outline-white/10 overflow-hidden p-1.5 bg-foreground"
        >
          <img
            src={item.icon}
            alt={item.name + " Blockchain Image"}
            className="w-full h-full"
          />
        </div>
      ))}
    </div>
  );
};
