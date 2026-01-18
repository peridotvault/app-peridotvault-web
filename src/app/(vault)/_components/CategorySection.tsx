/* eslint-disable @next/next/no-img-element */
import { CarouselWrapper } from "@/shared/components/CarouselWrapper";
import { TypographyH2 } from "@/shared/components/ui/TypographyH2";
import { IMAGE_LOADING } from "@/shared/constants/image";
import { STYLE_ROUNDED_CARD } from "@/shared/constants/style";
import { Category } from "@/shared/types/category";

type Props = {
  categories: Category[];
};

export const CategorySection = ({ categories }: Props) => {
  return (
    <section className="flex justify-center w-full px-10">
      <div className="flex flex-col gap-3 w-full items-center">
        <div className="flex max-w-7xl mx-auto w-full">
          <TypographyH2 text="Favorite Categories" />
        </div>
        {/* contents  */}
        <CarouselWrapper
          items={categories}
          pageSize={4}
          renderItem={(item) => (
            <div
              key={item.category_id}
              className={`w-full aspect-square ${STYLE_ROUNDED_CARD} bg-muted overflow-hidden bg-linear-to-t from-black relative duration-300 flex items-end font-medium p-6 text-xl group cursor-pointer`}
            >
              <img
                src={item.cover_image || IMAGE_LOADING}
                alt={item.name + " Image"}
                className="w-full h-full object-cover absolute top-0 left-0 opacity-80 duration-300 group-hover:scale-105"
              />
              <span className="z-5 bg-card/70 px-3 py-1 rounded-lg">
                {item.name}
              </span>
            </div>
          )}
        />
      </div>
    </section>
  );
};
