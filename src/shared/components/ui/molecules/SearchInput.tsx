"use client";

/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { STYLE_HOVER } from "@/shared/constants/style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { PriceCoin } from "./CoinWithAmmount";
import { GameApi, GameTopApi } from "@/core/api/game.api.type";
import { getGamesApi, getTopGamesApi } from "@/core/api/game.api";
import { urlGameDetail } from "@/features/game/configs/url.config";
import { getAssetUrl } from "@/shared/utils/helper.url";
import { IMAGE_LOADING } from "@/shared/constants/image";
import { useModal } from "@/core/ui-system/modal/modal.store";
import ModalShell from "@/core/ui-system/modal/ModalShell";
import { useClickSound } from "@/shared/hooks/useClickSound";
import { EmbedLink } from "@/features/security/embed/embed.component";

interface SearchInputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

const SEARCH_LIMIT = 4;
const SEARCH_DEBOUNCE_MS = 250;

export function SearchInput({
  value,
  placeholder = "Search...",
  onChange,
  className,
}: SearchInputProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const modalIdRef = useRef<string | null>(null);
  const [results, setResults] = useState<GameApi[]>([]);
  const [popularGames, setPopularGames] = useState<GameTopApi[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const playClick = useClickSound("/sounds/click.mp3", 0.6);

  const trimmedValue = value.trim();
  const hasQuery = trimmedValue.length > 0;
  const isLoading = hasQuery ? isLoadingResults : isLoadingPopular;

  useEffect(() => {
    return () => {
      if (modalIdRef.current) {
        useModal.getState().close(modalIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const isInsideInput = !!containerRef.current?.contains(target as Node);
      const isInsideModal = modalIdRef.current
        ? !!target?.closest(
            `[data-search-modal-panel="${modalIdRef.current}"]`,
          )
        : false;

      if (isInsideInput || isInsideModal) return;
      setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!isOpen || !hasQuery) {
      setResults([]);
      setIsLoadingResults(false);
      return;
    }

    let cancelled = false;
    setIsLoadingResults(true);

    const timeoutId = window.setTimeout(async () => {
      try {
        const nextResults = await getGamesApi({
          q: trimmedValue,
          limit: SEARCH_LIMIT,
          page: 1,
        });

        if (!cancelled) {
          setResults(nextResults.slice(0, SEARCH_LIMIT));
        }
      } catch {
        if (!cancelled) {
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingResults(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [hasQuery, isOpen, trimmedValue]);

  useEffect(() => {
    if (!isOpen || hasQuery || popularGames.length > 0 || isLoadingPopular) {
      return;
    }

    let cancelled = false;
    setIsLoadingPopular(true);

    void getTopGamesApi()
      .then((items) => {
        if (!cancelled) {
          setPopularGames(items.slice(0, SEARCH_LIMIT));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPopularGames([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingPopular(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [hasQuery, isLoadingPopular, isOpen, popularGames.length]);

  const renderPanelContent = useCallback(
    (modalId: string) => (
      <div data-search-modal-panel={modalId}>
        <div className="border-b border-border/70 px-4 py-3">
          <h2 className="text-sm font-medium text-foreground/90">
            {hasQuery ? "Search Games" : "Popular Games"}
          </h2>
        </div>

        <div className="flex flex-col p-2">
          {hasQuery ? (
            isLoadingResults ? (
              <StateRow label="Searching games..." />
            ) : results.length > 0 ? (
              results.map((item) => (
                <SearchResultCard
                  key={item.game_id}
                  game={item}
                  onSelect={() => setIsOpen(false)}
                />
              ))
            ) : (
              <StateRow label={`No game found for "${trimmedValue}"`} />
            )
          ) : popularGames.length > 0 ? (
            popularGames.map((item) => (
              <PopularGameCard
                key={item.game_id}
                game={item}
                onSelect={() => setIsOpen(false)}
              />
            ))
          ) : isLoadingPopular || isOpen ? (
            <StateRow label="Loading popular games..." />
          ) : (
            <StateRow label="No popular games available right now." />
          )}
        </div>
      </div>
    ),
    [
      hasQuery,
      isLoadingPopular,
      isLoadingResults,
      isOpen,
      popularGames,
      results,
      trimmedValue,
    ],
  );

  const renderSearchModal = useCallback(
    (modalId: string, rect: DOMRect) => (
      <ModalShell
        id={modalId}
        centered={false}
        withBackdrop={false}
        containerClassName="fixed inset-0 z-50 pointer-events-none"
        panelClassName="pointer-events-auto absolute overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20"
        panelStyle={{
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width,
        }}
        onCloseStart={() => {
          if (modalIdRef.current === modalId) {
            modalIdRef.current = null;
            setIsOpen(false);
          }
        }}
      >
        {renderPanelContent(modalId)}
      </ModalShell>
    ),
    [renderPanelContent],
  );

  const syncSearchModal = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    const modalId = modalIdRef.current;
    if (!rect || !modalId) return;

    useModal.getState().update(
      modalId,
      (id) => renderSearchModal(id, rect),
      { lockScroll: false },
    );
  }, [renderSearchModal]);

  useEffect(() => {
    if (!isOpen) {
      if (modalIdRef.current) {
        useModal.getState().close(modalIdRef.current);
        modalIdRef.current = null;
      }
      return;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (!modalIdRef.current) {
      modalIdRef.current = useModal.getState().open(
        (id) => renderSearchModal(id, rect),
        { lockScroll: false },
      );
      return;
    }

    syncSearchModal();
  }, [isOpen, renderSearchModal, syncSearchModal]);

  useEffect(() => {
    if (!isOpen || !modalIdRef.current) return;
    syncSearchModal();
  }, [hasQuery, isLoadingPopular, isLoadingResults, popularGames, results, syncSearchModal, trimmedValue, isOpen]);

  useEffect(() => {
    if (!isOpen || !modalIdRef.current) return;

    window.addEventListener("resize", syncSearchModal);
    window.addEventListener("scroll", syncSearchModal, true);

    return () => {
      window.removeEventListener("resize", syncSearchModal);
      window.removeEventListener("scroll", syncSearchModal, true);
    };
  }, [isOpen, syncSearchModal]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className ?? ""}`}>
      <div
        className={`
          flex items-center gap-2
          rounded-xl border border-border
          px-3 py-2
          w-full
          bg-transparent
          hover:cursor-text
          ${STYLE_HOVER}
        `}
        onClick={() => {
          playClick();
          inputRef.current?.focus();
          setIsOpen(true);
        }}
      >
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="h-4 w-4 text-muted-foreground"
        />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="
            h-6 w-full bg-transparent
            outline-none
            placeholder:text-muted-foreground
          "
        />

        {isLoading ? (
          <FontAwesomeIcon
            icon={faSpinner}
            className="animate-spin text-muted-foreground"
          />
        ) : null}
      </div>
    </div>
  );
}

function SearchResultCard({
  game,
  onSelect,
}: {
  game: GameApi;
  onSelect: () => void;
}) {
  const imageSrc = game.cover_horizontal_image || IMAGE_LOADING;
  const playClick = useClickSound("/sounds/click.mp3", 0.6);

  return (
    <EmbedLink
      href={urlGameDetail({
        name: game.name,
        game_id: game.game_id,
      })}
      onClick={() => {
        playClick();
        onSelect();
      }}
      className="flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-background/70"
    >
      <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
        <img
          src={resolveSearchImage(imageSrc)}
          alt={game.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 font-medium">{game.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {game.description}
        </p>
      </div>

      <div className="shrink-0 rounded-lg bg-background/80 px-3 py-2">
        <PriceCoin amount={game.price ?? 0} textSize="sm" />
      </div>
    </EmbedLink>
  );
}

function PopularGameCard({
  game,
  onSelect,
}: {
  game: GameTopApi;
  onSelect: () => void;
}) {
  const imageSrc = game.cover_horizontal_image || IMAGE_LOADING;
  const playClick = useClickSound("/sounds/click.mp3", 0.6);

  return (
    <EmbedLink
      href={urlGameDetail({
        name: game.name,
        game_id: game.game_id,
      })}
      onClick={() => {
        playClick();
        onSelect();
      }}
      className="flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-background/70"
    >
      <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
        <img
          src={resolveSearchImage(imageSrc)}
          alt={game.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-background/80 px-2 py-1 text-xs text-muted-foreground">
            #{game.rank}
          </span>
          <h3 className="line-clamp-1 font-medium">{game.name}</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Popular on PeridotVault
        </p>
      </div>
    </EmbedLink>
  );
}

function StateRow({ label }: { label: string }) {
  return (
    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function resolveSearchImage(src: string) {
  if (!src) return IMAGE_LOADING;
  if (src.startsWith("/")) return src;
  return getAssetUrl(src);
}
