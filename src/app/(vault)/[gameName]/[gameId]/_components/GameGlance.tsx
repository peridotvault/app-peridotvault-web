/* eslint-disable @next/next/no-img-element */
import { ContainerPadding } from "@/shared/components/ui/ContainerPadding";
import CarouselPreview from "./CarouselPreview";
import { SMALL_GRID, STYLE_ROUNDED_CARD } from "@/shared/constants/style";
import { GamePriview } from "@/features/game/published/media.type";

type Props = {
  previews: GamePriview[];
  coverHorizontalImage: string;
  gameName: string;
  gameDescription: string;
  tags: string[];
};

export const GameGlance = ({
  previews,
  coverHorizontalImage,
  gameName,
  gameDescription,
  tags,
}: Props) => {
  return (
    <ContainerPadding className="flex gap-12 max-lg:flex-col">
      {/* Previews */}
      <div className="overflow-hidden flex w-full">
        <CarouselPreview
          items={
            previews.length
              ? previews
              : [
                  {
                    kind: "image" as const,
                    src: coverHorizontalImage,
                  },
                ]
          }
        />
      </div>

      {/* Game Details */}
      <dl
        className={
          "flex flex-col justify-between gap-6 relative pb-6 w-full shrink-0 " +
          SMALL_GRID
        }
      >
        <div
          className={
            "absolute w-full h-full top-0 left-0 bg-linear-to-l from-card to-70% -z-1 " +
            STYLE_ROUNDED_CARD
          }
        />
        <div className="flex flex-col gap-6">
          <>
            {coverHorizontalImage ? (
              <img
                src={coverHorizontalImage}
                alt={"Cover game " + gameName}
                className={
                  "w-full aspect-video object-cover " + STYLE_ROUNDED_CARD
                }
              />
            ) : (
              <div
                className={
                  "w-full aspect-video bg-muted animate-pulse" +
                  STYLE_ROUNDED_CARD
                }
              />
            )}
          </>
          <div className="pr-6">
            <>
              <dt className="sr-only">Game Description</dt>
              <dd>{gameDescription}</dd>
            </>
          </div>
        </div>
        <div className="pr-6">
          <div className="flex flex-col gap-3">
            <dt className="text-muted-foreground">Tags</dt>
            <dd className="flex flex-wrap gap-3">
              {tags.map((item, index) => (
                <span
                  key={index}
                  className="bg-foreground/15 py-1 px-2 rounded-lg capitalize"
                >
                  {item}
                </span>
              ))}
            </dd>
          </div>
        </div>
      </dl>
    </ContainerPadding>
  );
};
