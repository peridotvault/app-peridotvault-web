import { ChainApi } from "@/core/api/chain.api.type";
import { OptimizedImage } from "@/shared/components/ui/atoms/OptimizedImage";

export const BlockchainStack = ({
  chain,
}: {
  chain: ChainApi[] | undefined;
}) => {
  if (!chain) {
    return <div></div>;
  }

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {chain.map((item) => (
        <div
          key={item.caip_2_id}
          className="inline-block size-7 rounded-full ring-2 ring-gray-900 outline -outline-offset-1 outline-white/10 overflow-hidden bg-foreground relative"
        >
          <div className="absolute inset-1.5">
            <OptimizedImage
              src={item.icon_url}
              alt={item.caip_2_id + " Image"}
              fill
              sizes="16px"
              className="object-contain"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
