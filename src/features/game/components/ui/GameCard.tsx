/* eslint-disable @next/next/no-img-element */
import { IMAGE_LOADING } from "@/shared/constants/image";
import { MyGameItem } from "../../services/library.service";

type Props = {
  item?: MyGameItem;
  loading: boolean;
};

export const GameCard = ({ item, loading }: Props) => {
  const isSekeleton = loading || !item;
  return (
    <div
      className={`flex flex-col gap-4 hover:bg-white/5 rounded-2xl duration-300 px-3 py-5 ${isSekeleton ? " animate-pulse " : ""}`}
    >
      {isSekeleton ? (
        <div className={`aspect-video w-full rounded-2xl bg-muted`} />
      ) : (
        <img
          src={IMAGE_LOADING}
          alt="Game Cover Image"
          className={`aspect-video w-full rounded-2xl ${
            isSekeleton ? " bg-muted " : ""
          }`}
        />
      )}

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-medium line-clamp-2">
          {isSekeleton ? "Peridot Game" : `Game ${item.gameId.slice(0, 10)}…`}
        </h2>

        <span aria-label="Game Studio" className="text-white/50">
          {isSekeleton
            ? "Antigane"
            : `Publisher: ${item.publisher.slice(0, 10)}…`}
        </span>

        {!isSekeleton && (
          <span className="text-white/40 text-sm">
            {item.active ? "Active" : "Inactive"} · PGC1:{" "}
            {item.pgc1.slice(0, 10)}…
          </span>
        )}
      </div>

      <div>
        <button
          className={`py-2 px-4 cursor-pointer rounded-lg ${
            isSekeleton ? " bg-muted text-muted-foreground " : " bg-accent "
          }`}
          disabled={isSekeleton || !item.active}
          onClick={() => {
            if (isSekeleton) return;
            console.log("Download:", item.gameId);
          }}
        >
          Download
        </button>
      </div>
    </div>
  );
};
