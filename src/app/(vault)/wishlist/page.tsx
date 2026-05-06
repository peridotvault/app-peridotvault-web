/* eslint-disable @next/next/no-img-element */
"use client";

import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { useAuthStore } from "@/features/auth/_store/auth.store";
import { IMAGE_LOADING } from "@/shared/constants/image";
import { getAssetUrl } from "@/shared/utils/helper.url";
import { STYLE_ROUNDED_CARD } from "@/shared/constants/style";
import { urlGameDetail } from "@/features/game/configs/url.config";
import { EmbedLink } from "@/features/security/embed/embed.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import { faHeartCirclePlus } from "@fortawesome/free-solid-svg-icons";

export default function WishlistPage() {
  const authStatus = useAuthStore((s) => s.status);
  const { items, loading, error, isEmpty } = useWishlist({ page: 1, limit: 50 });

  if (authStatus === "anonymous") {
    return (
      <main className="max-w-400 w-full mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <FontAwesomeIcon icon={faStarOutline} className="text-3xl text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold mb-2">Your Wishlist</h1>
            <p className="text-muted-foreground max-w-md">
              Connect your wallet to view and manage your wishlisted games.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!loading && error) {
    return (
      <section className="text-white/50 w-full h-full flex justify-center items-center py-20">
        {error}
      </section>
    );
  }

  return (
    <main className="max-w-400 w-full mx-auto p-8 flex flex-col gap-8">
      <section>
        <h1 className="text-4xl font-medium">Wishlist</h1>
        {!loading && items.length > 0 && (
          <p className="text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? "game" : "games"} saved
          </p>
        )}
      </section>

      <section>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-3/4 bg-muted rounded-xl" />
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <FontAwesomeIcon
                icon={faHeartCirclePlus}
                className="text-2xl text-muted-foreground"
              />
            </div>
            <div>
              <p className="text-lg font-medium text-muted-foreground">
                Your wishlist is empty
              </p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Browse games and click the star to add them here.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <EmbedLink
                key={item.game_id}
                href={urlGameDetail({
                  name: item.name,
                  game_id: item.game_id,
                })}
                className={`w-full group relative overflow-hidden ${STYLE_ROUNDED_CARD}`}
              >
                <div className="w-full aspect-3/4 bg-muted">
                  <img
                    src={
                      item.cover_vertical_image
                        ? getAssetUrl(item.cover_vertical_image)
                        : IMAGE_LOADING
                    }
                    alt={item.name}
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium line-clamp-1">
                    {item.name}
                  </h3>
                </div>
              </EmbedLink>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
