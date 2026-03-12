import { ContainerPadding } from "@/shared/components/ContainerPadding";
import { TypographyH2 } from "@/shared/components/ui/atoms/TypographyH2";
import { IMAGE_LOADING } from "@/shared/constants/image";
import { STYLE_ROUNDED_CARD } from "@/shared/constants/style";
import { GameHorizontalCard } from "./GameHorizontalCard";
import { CarouselWrapper } from "@/shared/components/ui/organisms/CarouselWrapper";
import { GameApi } from "@/core/api/game.api.type";
import { sendTrackGameView } from "@/features/event/services/sendTrackGameView";

type Props = {
  games: GameApi[];
};

export const GameRelated = ({ games }: Props) => {
  return (
    <section className="flex justify-center w-full">
      <ContainerPadding>
        <div
          className={
            "flex flex-col gap-3 w-full items-center p-10 bg-card " +
            STYLE_ROUNDED_CARD
          }
        >
          <div className="flex max-w-7xl mx-auto w-full">
            <TypographyH2 text="More Like This" />
          </div>
          {/* contents  */}
          <CarouselWrapper
            items={games}
            pageSize={4}
            renderItem={(item, index) => (
              <GameHorizontalCard
                key={index}
                gameId={item.game_id}
                gameName={item.name}
                imgUrl={item.cover_horizontal_image ?? IMAGE_LOADING}
                price={item.price ?? 0}
                onClick={() =>
                  sendTrackGameView({
                    game_id: item.game_id,
                    source: "detail_related",
                  })
                }
              />
            )}
          />
        </div>
      </ContainerPadding>
    </section>
  );
};
