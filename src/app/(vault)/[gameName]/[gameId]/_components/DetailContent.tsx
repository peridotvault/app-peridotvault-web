"use client";

import { PriceCoin } from "@/shared/components/CoinWithAmmount";
import {
  BUTTON_COLOR,
  BUTTON_HIGHLIGHT_COLOR,
  SMALL_GRID,
  STYLE_ROUNDED_BUTTON,
  STYLE_ROUNDED_CARD,
} from "@/shared/constants/style";
import {
  faBookmark,
  faFlag,
  faShare,
  faShirt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWindows,
  faApple,
  faLinux,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

/* eslint-disable @next/next/no-img-element */
export const DetailContent = () => {
  const [buying, setBuying] = useState(false);

  const handleBuyClick = async () => {
    setBuying(true);
    setTimeout(() => {
      setBuying(false);
    }, 800);
  };

  const [purchaseState] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  return (
    <dl className={"flex flex-col gap-4 w-full " + SMALL_GRID}>
      <div className={"flex flex-col gap-3 bg-card p-6" + STYLE_ROUNDED_CARD}>
        <PriceCoin amount={10000000000} tokenCanister={""} textSize="xl" />
        {purchaseState ? (
          <span
            className={`text-sm font-medium ${
              purchaseState.status === "success"
                ? "text-success"
                : "text-destructive"
            }`}
          >
            {purchaseState.message}
          </span>
        ) : null}
        <div className="flex gap-4">
          <button
            onClick={handleBuyClick}
            disabled={buying}
            className={
              "w-full cursor-pointer " +
              BUTTON_HIGHLIGHT_COLOR +
              STYLE_ROUNDED_BUTTON
            }
          >
            Buy Now
          </button>
          <button
            className={
              "aspect-square shrink-0 cursor-pointer " +
              BUTTON_COLOR +
              STYLE_ROUNDED_BUTTON
            }
          >
            <FontAwesomeIcon icon={faBookmark} />
          </button>
        </div>
        <button
          className={"cursor-pointer " + BUTTON_COLOR + STYLE_ROUNDED_BUTTON}
        >
          <FontAwesomeIcon icon={faShirt} />
          <span>Market</span>
        </button>
      </div>

      <div
        aria-label="Rating Age from Global Rating"
        className={"bg-card p-5 flex gap-4 " + STYLE_ROUNDED_CARD}
      >
        <div className="w-18 shrink-0">
          <img
            src="https://www.globalratings.com/images/ratings-guide/Generic_3_48.png"
            alt=""
            className="w-full object-contain"
          />
        </div>
        <div className="flex flex-col gap-2">
          <dt className="sr-only">Age</dt>
          <dd className="text-lg font-bold" aria-label="More than 7+">
            7+
          </dd>
          <hr className="border-white/20 mb-1" />
          <p className="text-sm text-foreground/50">
            Violence involving fantasy characters and/or non-graphic violence
            involving
          </p>
        </div>
      </div>

      <table className="mb-4">
        <tbody>
          <tr className="border-b border-white/15 flex justify-between items-center w-full py-3">
            <td className="text-muted-foreground">Platform</td>
            <td className="flex gap-1 text-lg">
              <FontAwesomeIcon icon={faApple} />
              <FontAwesomeIcon icon={faWindows} />
              <FontAwesomeIcon icon={faLinux} />
            </td>
          </tr>
          <tr className="border-b border-white/15 flex justify-between w-full py-3">
            <td className="text-muted-foreground">
              <dt>Developer</dt>
            </td>
            <td>VOID Interactive</td>
          </tr>
          <tr className="border-b border-white/15 flex justify-between w-full py-3">
            <td className="text-muted-foreground">Publisher</td>
            <td>VOID Interactive</td>
          </tr>
          <tr className="border-b border-white/15 flex justify-between w-full py-3">
            <td className="text-muted-foreground">Release Date</td>
            <td>12/13/23</td>
          </tr>
          <tr className="border-b border-white/15 flex justify-between w-full py-3">
            <td className="text-muted-foreground">Website</td>
            <td>
              <a href="https://peridotvault.com" className="text-highlight">
                https://peridotvault.com
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-4">
        <button
          className={"cursor-pointer " + BUTTON_COLOR + STYLE_ROUNDED_BUTTON}
        >
          <FontAwesomeIcon icon={faShare} />
          <span>Share</span>
        </button>
        <button
          className={"cursor-pointer " + BUTTON_COLOR + STYLE_ROUNDED_BUTTON}
        >
          <FontAwesomeIcon icon={faFlag} />
          <span>Report</span>
        </button>
      </div>
    </dl>
  );
};
